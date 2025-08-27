
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, FileText, Globe, X } from 'lucide-react';
import { toast } from 'sonner';
import { useBlogs, useBlogMutation } from '@/hooks/useBlogs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminBlogs = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { data: blogs = [], isLoading } = useBlogs();
  const blogMutation = useBlogMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    content: '',
    content_ar: '',
    excerpt: '',
    excerpt_ar: '',
    featured_image: '',
    slug: '',
    status: 'draft' as 'draft' | 'published',
    keywords: [] as string[]
  });

  const [keywordInput, setKeywordInput] = useState('');

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  const handleKeywordInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBlog) {
        await blogMutation.mutateAsync({
          action: 'update',
          blogData: {
            ...formData,
            updated_at: new Date().toISOString()
          },
          blogId: editingBlog.id
        });
        toast.success(t('blogPostUpdated'));
      } else {
        const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        await blogMutation.mutateAsync({
          action: 'create',
          blogData: {
            ...formData,
            slug: slug || `blog-${Date.now()}`,
            author_id: user?.id || '',
            published_at: formData.status === 'published' ? new Date().toISOString() : null
          }
        });
        toast.success(t('blogPostCreated'));
      }
      
      handleCloseModal();
    } catch (error: any) {
      toast.error(t('failedToSave') + ': ' + error.message);
    }
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      title_ar: blog.title_ar || '',
      content: blog.content,
      content_ar: blog.content_ar || '',
      excerpt: blog.excerpt || '',
      excerpt_ar: blog.excerpt_ar || '',
      featured_image: blog.featured_image || '',
      slug: blog.slug,
      status: blog.status,
      keywords: blog.keywords || []
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await blogMutation.mutateAsync({
          action: 'delete',
          blogId: id
        });
        toast.success(t('blogPostDeleted'));
      } catch (error: any) {
        toast.error(t('failedToDelete') + ': ' + error.message);
      }
    }
  };

  const toggleStatus = async (blog: any) => {
    try {
      const newStatus = blog.status === 'draft' ? 'published' : 'draft';
      await blogMutation.mutateAsync({
        action: 'update',
        blogData: {
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        },
        blogId: blog.id
      });
      toast.success(t('blogStatusUpdated'));
    } catch (error: any) {
      toast.error(t('failedToUpdateStatus') + ': ' + error.message);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      title_ar: '',
      content: '',
      content_ar: '',
      excerpt: '',
      excerpt_ar: '',
      featured_image: '',
      slug: '',
      status: 'draft',
      keywords: []
    });
    setKeywordInput('');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('blogManagement')}</h2>
          <p className="text-gray-600">{t('createManageBlogPosts')}</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('createBlogPost')}
        </Button>
      </div>

      {isCreateModalOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBlog ? t('editBlogPost') : t('createNewBlogPost')}</CardTitle>
            <CardDescription>{t('fillBlogDetails')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('title')}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_ar">{t('titleArabic')}</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="excerpt">{t('excerpt')}</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    placeholder={t('briefDescription')}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt_ar">{t('excerptArabic')}</Label>
                  <Textarea
                    id="excerpt_ar"
                    value={formData.excerpt_ar}
                    onChange={(e) => setFormData({...formData, excerpt_ar: e.target.value})}
                    placeholder={t('briefDescription')}
                    className="min-h-[80px]"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="content">{t('content')}</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    required
                    className="min-h-[200px]"
                    placeholder={t('writeBlogContent')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content_ar">{t('contentArabic')}</Label>
                  <Textarea
                    id="content_ar"
                    value={formData.content_ar}
                    onChange={(e) => setFormData({...formData, content_ar: e.target.value})}
                    className="min-h-[200px]"
                    placeholder={t('writeBlogContentArabic')}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="featured_image">{t('featuredImageUrl')}</Label>
                  <Input
                    id="featured_image"
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">{t('status')}</Label>
                  <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{t('draft')}</SelectItem>
                      <SelectItem value="published">{t('published')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">SEO Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={handleKeywordInputKeyPress}
                    placeholder="Enter a keyword and press Enter"
                  />
                  <Button type="button" onClick={handleAddKeyword}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {keyword}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveKeyword(keyword)}
                      />
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Keywords are used for SEO and are not displayed on the website
                </p>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={blogMutation.isPending}>
                  {editingBlog ? t('updatePost') : t('createPost')}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  {t('cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                    <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                      {blog.status === 'published' ? (
                        <>
                          <Globe className="mr-1 h-3 w-3" />
                          {t('published')}
                        </>
                      ) : (
                        <>
                          <FileText className="mr-1 h-3 w-3" />
                          {t('draft')}
                        </>
                      )}
                    </Badge>
                  </div>
                  {blog.excerpt && (
                    <p className="text-gray-600 mb-2">{blog.excerpt}</p>
                  )}
                  {blog.keywords && blog.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {blog.keywords.slice(0, 5).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {blog.keywords.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{blog.keywords.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{t('updated')}: {new Date(blog.updated_at).toLocaleDateString()}</span>
                    {blog.published_at && (
                      <span>{t('publishedOn')}: {new Date(blog.published_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleStatus(blog)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(blog.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogs;
