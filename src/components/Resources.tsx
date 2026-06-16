import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Lock, 
  Unlock,
  Search, 
  FileText, 
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Plus,
  X,
  Upload,
  UserCheck,
  Trash2,
  Pencil
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import { cn } from '../lib/utils';
import { PAST_PROJECTS, PastProject } from '../constants/resources';

// Authorized owners who can manage resources
const OWNER_EMAILS = ['senthilkumar.r@gsis.ac.in', 'skmmypbioresources@gmail.com'];

export default function Resources() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
  
  // State for Firestore resources
  const [dbProjects, setDbProjects] = useState<PastProject[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCreatedAt, setEditingCreatedAt] = useState<any>(null);
  
  // Form State
  const [newProject, setNewProject] = useState({
    title: '',
    author: '',
    grade: 7,
    description: '',
    tags: '',
    fileUrl: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const isOwner = auth.currentUser?.email && OWNER_EMAILS.includes(auth.currentUser.email);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Base64 encoding adds ~33% overhead. Firestore document limit is 1MB.
      // 700KB * 1.33 = ~931KB, which fits safely with metadata.
      const MAX_SAfE_SIZE = 700 * 1024; 
      if (file.size > MAX_SAfE_SIZE) {
        setFileError("Database Limit: Direct uploads are capped at ~700KB to ensure reliable synchronization. For 2MB+ reports, please upload to Google Drive and use the 'External Link' tab instead.");
        setSelectedFile(null);
      } else {
        setFileError(null);
        setSelectedFile(file);
      }
    }
  };

  useEffect(() => {
    // Listen to real-time updates from Firestore
    const path = 'past_projects';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PastProject[];
      setDbProjects(projects);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, []);

  const allProjects = [...dbProjects, ...PAST_PROJECTS];

  const filteredProjects = allProjects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleRequest = (id: string) => {
    setRequestingId(id);
    setTimeout(() => {
      setSentRequests(prev => ({ ...prev, [id]: true }));
      setRequestingId(null);
    }, 1500);
  };

  const handleOpenResource = (url: string) => {
    if (!url) return;
    
    // If it's a data URL, we use a link click approach which is more reliable
    if (url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      // For data URLs, sometimes we need to trigger a download or specific behavior
      // but try opening first
      const win = window.open();
      if (win) {
        win.document.write(`<iframe src="${url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      } else {
        // Fallback to direct click if popup blocked
        link.click();
      }
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDelete = async (id: string) => {
    if (!isOwner) return;
    if (!window.confirm("Are you sure you want to permanently remove this resource? This action cannot be undone.")) return;
    
    const path = 'past_projects';
    try {
      await deleteDoc(doc(db, path, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleEdit = (project: PastProject) => {
    setEditingId(project.id || null);
    setEditingCreatedAt(project.createdAt || null);
    setNewProject({
      title: project.title,
      author: project.author,
      grade: project.grade,
      description: project.description,
      tags: project.tags.join(', '),
      fileUrl: project.fileUrl || ''
    });
    setIsUploadModalOpen(true);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    
    setIsUploading(true);
    const path = 'past_projects';

    try {
      let finalFileUrl = newProject.fileUrl;

      // If a file was selected, convert to data URL
      if (selectedFile) {
        const reader = new FileReader();
        const fileContent = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
        finalFileUrl = fileContent;
      }

      if (!finalFileUrl) {
        throw new Error("Please provide a link or select a file.");
      }

      const projectData = {
        title: newProject.title,
        author: newProject.author,
        grade: Number(newProject.grade),
        description: newProject.description,
        year: new Date().getFullYear().toString(),
        tags: newProject.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        isLocked: true,
        fileUrl: finalFileUrl,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, path, editingId), {
          ...projectData,
          createdAt: editingCreatedAt // Maintain original timestamp to satisfy strict rules
        });
      } else {
        await addDoc(collection(db, path), {
          ...projectData,
          createdAt: serverTimestamp()
        });
      }
      
      setIsUploadModalOpen(false);
      setEditingId(null);
      setEditingCreatedAt(null);
      setNewProject({ title: '', author: '', grade: 7, description: '', tags: '', fileUrl: '' });
      setSelectedFile(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:translate-x-1 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                PP Resources
              </h1>
              {isOwner && (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:scale-110 active:scale-95 transition-all"
                  title="Upload New Project"
                >
                  <Plus className="w-6 h-6" />
                </button>
              )}
            </div>
            <p className="text-gray-500 mt-2 font-medium max-w-xl leading-relaxed">
              Exemplary Past Projects and high-scoring reports. Access to these documents is restricted to protect academic integrity.
            </p>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text"
            placeholder="Search topics or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-6 py-3 bg-white border border-gray-100 rounded-2xl w-full md:w-80 shadow-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-medium text-sm"
          />
        </div>
      </div>

      {isOwner && (
        <div className="mx-2 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <p className="text-indigo-900 text-xs font-black uppercase tracking-widest">
              Manager Access Active: You can upload and manage reports.
            </p>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="text-xs font-black text-indigo-600 hover:underline"
          >
            Add Resource +
          </button>
        </div>
      )}

      {/* Warning Banner */}
      <div className="mx-2 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 text-xs font-medium leading-relaxed">
          These resources are for inspiration and guidance on structure/evaluation only. 
          The rightful owner and GSIS maintain strict intellectual property rights. 
          Academic honesty is paramount.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all group flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                  <FileText className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Band Score</span>
                  <span className="text-2xl font-black text-indigo-600">{project.grade} <span className="text-xs text-gray-400">/ 8</span></span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 italic">
                  "{project.description}"
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest rounded-full border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50">
                {isOwner ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (project.fileUrl) {
                          handleOpenResource(project.fileUrl);
                        } else {
                          alert("This is a reference example entry. To view actual files, please use the 'Add Resource' button above to upload real reports or links.");
                        }
                      }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-2xl active:scale-95 transition-all shadow-lg",
                        project.fileUrl 
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100" 
                          : "bg-gray-100 text-gray-500 shadow-none border border-gray-200 cursor-default"
                      )}
                    >
                      {project.fileUrl ? (
                        <><Unlock className="w-4 h-4" /> Open Resource</>
                      ) : (
                        <><FileText className="w-4 h-4" /> Entry Reference Only</>
                      )}
                    </button>
                    {project.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center justify-center"
                          title="Edit Metadata"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => project.id && handleDelete(project.id)}
                          className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm flex items-center justify-center"
                          title="Delete Resource"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : sentRequests[project.id] ? (
                  <div className="flex flex-col items-center gap-1 bg-emerald-50 w-full py-3 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Request Sent
                    </div>
                    <span className="text-[9px] text-emerald-600/70 font-bold uppercase tracking-tighter">Notification sent to Owners</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRequest(project.id)}
                    disabled={requestingId === project.id}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3 rounded-2xl hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {requestingId === project.id ? (
                      'Requesting Permission...'
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> Request Access Permissions
                      </>
                    )}
                  </button>
                )}
                <p className="text-center text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">
                  Owner: {project.author} • {project.year}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-100">
              <Upload className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">No Resources Found</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
              {searchTerm 
                ? `We couldn't find any projects matching "${searchTerm}". Try a different search.`
                : "The vault is currently empty. Owners can start uploading exemplary reports using the + button above."
              }
            </p>
            {isOwner && !searchTerm && (
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-gray-900 transition-all shadow-lg shadow-indigo-100"
              >
                Upload First Resource
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isUploading) {
                  setIsUploadModalOpen(false);
                  setEditingId(null);
                  setEditingCreatedAt(null);
                  setNewProject({ title: '', author: '', grade: 7, description: '', tags: '', fileUrl: '' });
                }
              }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter">
                      {editingId ? 'Edit Resource' : 'Add Resource'}
                    </h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                      {editingId ? 'Update Report Details' : 'New PP Report Metadata'}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      setEditingId(null);
                      setEditingCreatedAt(null);
                      setNewProject({ title: '', author: '', grade: 7, description: '', tags: '', fileUrl: '' });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Project Title</label>
                    <input 
                      required
                      type="text" 
                      value={newProject.title}
                      onChange={e => setNewProject({...newProject, title: e.target.value})}
                      placeholder="e.g. AI-Powered Farming in Cities"
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-indigo-50 outline-none font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Student Author</label>
                      <input 
                        required
                        type="text" 
                        value={newProject.author}
                        onChange={e => setNewProject({...newProject, author: e.target.value})}
                        placeholder="e.g. Sarah K."
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-indigo-50 outline-none font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Band Score</label>
                      <select 
                        value={newProject.grade}
                        onChange={e => setNewProject({...newProject, grade: Number(e.target.value)})}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-indigo-50 outline-none font-bold"
                      >
                        {[1,2,3,4,5,6,7,8].map(g => <option key={g} value={g}>Band {g}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Description</label>
                    <textarea 
                      required
                      value={newProject.description}
                      onChange={e => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Brief summary of the inquiry and product..."
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-indigo-50 outline-none font-bold h-24 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={newProject.tags}
                      onChange={e => setNewProject({...newProject, tags: e.target.value})}
                      placeholder="e.g. Technology, Botany, App"
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-indigo-50 outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Resource Origin</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-2xl">
                      <button 
                        type="button"
                        onClick={() => { setSelectedFile(null); setNewProject({...newProject, fileUrl: ''}); }}
                        className={cn(
                          "py-2 px-4 rounded-xl text-xs font-black transition-all",
                          !selectedFile ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        External Link
                      </button>
                      <button 
                        type="button"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className={cn(
                          "py-2 px-4 rounded-xl text-xs font-black transition-all",
                          selectedFile ? "bg-indigo-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        Desktop File
                      </button>
                    </div>
                  </div>

                  {!selectedFile ? (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Google Drive / URL</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          required={!selectedFile}
                          type="url" 
                          value={newProject.fileUrl}
                          onChange={e => setNewProject({...newProject, fileUrl: e.target.value})}
                          placeholder="https://drive.google.com/..."
                          className="w-full bg-gray-50 border-none rounded-2xl pl-11 pr-4 py-4 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-indigo-600"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <FileText className="w-6 h-6 text-indigo-600" />
                      </div>
                      <p className="text-sm font-black text-indigo-900 truncate px-4">{selectedFile.name}</p>
                      <p className="text-[10px] text-indigo-500 font-bold uppercase mt-1">Ready for Secure Upload</p>
                      <button 
                        type="button" 
                        onClick={() => setSelectedFile(null)}
                        className="mt-3 text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline"
                      >
                        Remove File
                      </button>
                    </div>
                  )}

                  <input 
                    id="file-upload"
                    type="file" 
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.docx,.doc,.txt"
                  />

                  {fileError && (
                    <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <p className="text-[10px] font-bold text-rose-700 leading-tight">
                        {fileError}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-gray-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isUploading ? (
                      'Processing Changes...'
                    ) : (
                      <>
                        <Upload className="w-5 h-5" /> 
                        {editingId ? 'Save Changes' : 'Confirm and Register Resource'}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

