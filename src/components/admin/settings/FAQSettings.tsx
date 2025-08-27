
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { HelpCircle, Plus, Trash2, Loader2 } from 'lucide-react';
import { useFAQs, useUpdateFAQs, FAQ } from '@/hooks/useFAQs';

const FAQSettings = () => {
  const { data: fetchedFAQs, isLoading } = useFAQs();
  const updateFAQsMutation = useUpdateFAQs();
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    if (fetchedFAQs) {
      setFaqs(fetchedFAQs);
    }
  }, [fetchedFAQs]);

  const addFAQ = () => {
    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question_en: '',
      question_ar: '',
      answer_en: '',
      answer_ar: '',
      order_index: faqs.length + 1,
      is_active: true
    };
    setFaqs([...faqs, newFAQ]);
  };

  const removeFAQ = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const updateFAQ = (id: string, field: keyof FAQ, value: string | number | boolean) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
  };

  const handleSave = () => {
    updateFAQsMutation.mutate(faqs);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HelpCircle className="mr-2 h-5 w-5" />
          Frequently Asked Questions
        </CardTitle>
        <CardDescription>
          Manage FAQs in English and Arabic
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">FAQ #{index + 1}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFAQ(faq.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Question (English)</Label>
                  <Input
                    value={faq.question_en}
                    onChange={(e) => updateFAQ(faq.id, 'question_en', e.target.value)}
                    placeholder="Enter question in English"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Question (Arabic)</Label>
                  <Input
                    value={faq.question_ar}
                    onChange={(e) => updateFAQ(faq.id, 'question_ar', e.target.value)}
                    placeholder="أدخل السؤال باللغة العربية"
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Answer (English)</Label>
                  <Textarea
                    value={faq.answer_en}
                    onChange={(e) => updateFAQ(faq.id, 'answer_en', e.target.value)}
                    placeholder="Enter answer in English"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Answer (Arabic)</Label>
                  <Textarea
                    value={faq.answer_ar}
                    onChange={(e) => updateFAQ(faq.id, 'answer_ar', e.target.value)}
                    placeholder="أدخل الإجابة باللغة العربية"
                    className="min-h-[100px]"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button onClick={addFAQ} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updateFAQsMutation.isPending}
          >
            {updateFAQsMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save FAQs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FAQSettings;
