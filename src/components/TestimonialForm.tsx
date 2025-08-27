
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TestimonialForm = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({
    comment: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to submit a testimonial');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user profile to fetch name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', user.id)
        .single();

      const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Anonymous';

      const { error } = await supabase
        .from('testimonials')
        .insert({
          name: fullName,
          comment: formData.comment,
          location: formData.location,
          rating: rating,
          is_active: false, // Will need admin approval
          is_featured: false
        });

      if (error) throw error;

      toast.success('Thank you! Your testimonial has been submitted for review.');
      setFormData({ comment: '', location: '' });
      setRating(5);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error('Failed to submit testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // Don't show the form if user is not logged in
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          {t('shareYourExperience') || 'Share Your Experience'}
        </CardTitle>
        <CardDescription>
          {t('testimonialDescription') || 'Tell us about your experience with our car rental service'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>{t('rating') || 'Rating'}</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating} {rating === 1 ? 'star' : 'stars'}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">{t('yourReview') || 'Your Review'}</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              placeholder={t('reviewPlaceholder') || 'Share your experience with our service...'}
              className="min-h-[120px]"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">{t('location') || 'Location'} (Optional)</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder={t('locationPlaceholder') || 'e.g., Riyadh, Saudi Arabia'}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !formData.comment.trim()}
          >
            {isSubmitting ? 'Submitting...' : (t('submitReview') || 'Submit Review')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TestimonialForm;
