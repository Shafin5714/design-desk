'use client';

import React, { useEffect, useState } from 'react';
import { Layers, Plus, LogOut, Clock, MoreVertical, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Image from 'next/image';

interface Project {
  _id: string;
  name: string;
  thumbnailUrl?: string;
  updatedAt: string;
}

export function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async () => {
    try {
      const response = await api.post('/projects', {
        name: 'Untitled Design',
        canvasNodes: []
      });
      router.push(`/editor/${response.data._id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create a new project. Please try again.');
    }
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this design?')) return;
    
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#5e21d9] to-[#01b4e4] flex items-center justify-center text-white shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">Design Desk</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Recent designs</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            
            {/* Create New Card */}
            <div 
              onClick={createNewProject}
              className="group cursor-pointer flex flex-col h-[280px] rounded-xl border border-dashed border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 group-hover:text-indigo-600 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center mb-4 transition-colors">
                  <Plus size={24} />
                </div>
                <span className="font-semibold text-sm">Create new design</span>
              </div>
            </div>

            {/* Project Cards */}
            {projects.map((project) => (
              <div 
                key={project._id}
                onClick={() => router.push(`/editor/${project._id}`)}
                className="group cursor-pointer flex flex-col h-[280px] rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-indigo-300 shadow-sm hover:shadow-md transition-all relative"
              >
                {/* Thumbnail Area */}
                <div className="h-[180px] w-full bg-gray-100 relative overflow-hidden border-b border-gray-100 flex-shrink-0">
                  {project.thumbnailUrl ? (
                    <Image 
                      src={project.thumbnailUrl} 
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
                      <Layers size={32} className="opacity-20 mb-2" />
                      <span className="text-xs font-medium text-gray-400">Blank Canvas</span>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Delete Button (visible on hover) */}
                  <button 
                    onClick={(e) => deleteProject(project._id, e)}
                    className="absolute top-2 right-2 p-2 bg-white/90 text-red-600 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all transform translate-y-1 group-hover:translate-y-0"
                    title="Delete design"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Details Area */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                  <h3 className="font-semibold text-sm text-gray-900 truncate" title={project.name}>
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Clock size={12} />
                    <span>
                      {new Date(project.updatedAt).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
