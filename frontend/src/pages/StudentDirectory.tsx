import { useState, useEffect } from 'react';
import { Search, MapPin, GraduationCap, ArrowRight, Loader2, Sparkles, User } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { apiRequest } from '../lib/api/config';
import { Link } from 'react-router-dom';

export default function StudentDirectory() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await apiRequest<any[]>('/api/students/');
                setStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.university && student.university.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium">Loading potential candidates...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Talent Network</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Profiles</h1>
                        <p className="text-slate-500 text-lg max-w-2xl">Browse and connect with the next generation of top talent from universities worldwide.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or university..."
                            className="pl-12 py-7 rounded-2xl border-slate-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg"
                        />
                    </div>
                </div>

                {/* Directory Grid */}
                {filteredStudents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStudents.map((student) => (
                            <Card key={student.student_id} className="group hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden border-slate-100">
                                <CardContent className="p-0">
                                    <div className="h-24 bg-gradient-to-br from-slate-50 to-indigo-50/50 group-hover:from-indigo-600 group-hover:to-violet-600 transition-all duration-500" />
                                    <div className="px-6 pb-8">
                                        <div className="-mt-12 mb-6">
                                            <div className="w-24 h-24 bg-white rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black text-indigo-600 overflow-hidden group-hover:scale-105 transition-transform">
                                                {student.full_name[0]}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{student.full_name}</h3>
                                                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium mt-1">
                                                    <GraduationCap className="w-4 h-4 text-slate-400" />
                                                    {student.university || "University not specified"}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="secondary" className="bg-slate-50 text-slate-600 font-bold px-3 py-1">
                                                    {student.degree_level || "Student"}
                                                </Badge>
                                                {student.skills && student.skills.slice(0, 2).map((skill: string) => (
                                                    <Badge key={skill} variant="outline" className="border-indigo-100 text-indigo-600 bg-indigo-50/30 font-bold px-3 py-1">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="pt-6 border-t border-slate-50">
                                                <Link to={`/student/profile/${student.student_id}`}>
                                                    <Button variant="ghost" className="w-full justify-between font-bold text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all py-6 rounded-xl">
                                                        View Full Profile
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <User className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No profiles found</h3>
                        <p className="text-slate-500">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
