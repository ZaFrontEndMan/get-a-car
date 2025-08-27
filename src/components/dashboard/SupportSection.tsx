
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Phone, Mail, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const SupportSection: React.FC = () => {
  const { t } = useLanguage();
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    priority: 'medium',
    description: ''
  });

  const faqs = [
    {
      question: t('faqBookingQuestion'),
      answer: t('faqBookingAnswer')
    },
    {
      question: t('faqCancelQuestion'),
      answer: t('faqCancelAnswer')
    },
    {
      question: t('faqPaymentQuestion'),
      answer: t('faqPaymentAnswer')
    },
    {
      question: t('faqDocumentsQuestion'),
      answer: t('faqDocumentsAnswer')
    }
  ];

  const tickets = [
    {
      id: 'TKT-001',
      subject: 'Booking confirmation issue',
      status: 'open',
      priority: 'high',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16'
    },
    {
      id: 'TKT-002',
      subject: 'Payment refund request',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-14'
    },
    {
      id: 'TKT-003',
      subject: 'Car pickup location',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-08'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New ticket:', newTicketForm);
    // Reset form
    setNewTicketForm({ subject: '', priority: 'medium', description: '' });
  };

  return (
    <div className="px-2 md:px-0">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">{t('support')}</h1>
      
      <Tabs defaultValue="faqs" className="w-full">
        <TabsList className="grid w-full grid-cols-3 text-xs md:text-sm">
          <TabsTrigger value="faqs" className="px-2 py-2">{t('faqs')}</TabsTrigger>
          <TabsTrigger value="tickets" className="px-2 py-2">{t('supportTickets')}</TabsTrigger>
          <TabsTrigger value="contact" className="px-2 py-2">{t('contact')}</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="mt-4 md:mt-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">{t('frequentlyAskedQuestions')}</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-sm md:text-base">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="mt-4 md:mt-6">
          <div className="space-y-4 md:space-y-6">
            {/* New Ticket Form */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-semibold">{t('createNewTicket')}</h2>
                <Plus className="h-5 w-5 text-primary" />
              </div>
              
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('subject')}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTicketForm.subject}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('enterSubject')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('priority')}
                  </label>
                  <select
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="low">{t('low')}</option>
                    <option value="medium">{t('medium')}</option>
                    <option value="high">{t('high')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('description')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newTicketForm.description}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder={t('describeIssue')}
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full md:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm md:text-base"
                >
                  {t('submitTicket')}
                </button>
              </form>
            </div>

            {/* Tickets - Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">{t('myTickets')}</h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('ticketId')}</TableHead>
                    <TableHead>{t('subject')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('priority')}</TableHead>
                    <TableHead>{t('created')}</TableHead>
                    <TableHead>{t('lastUpdate')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          {getStatusIcon(ticket.status)}
                          <span className="capitalize">{t(ticket.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {t(ticket.priority)}
                        </span>
                      </TableCell>
                      <TableCell>{ticket.createdAt}</TableCell>
                      <TableCell>{ticket.updatedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Tickets - Mobile Grid */}
            <div className="md:hidden bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">{t('myTickets')}</h2>
              </div>
              <div className="space-y-4 p-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{ticket.id}</h3>
                        <p className="text-sm text-gray-600 mt-1">{ticket.subject}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {t(ticket.priority)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {getStatusIcon(ticket.status)}
                        <span className="text-sm capitalize">{t(ticket.status)}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>{t('created')}: {ticket.createdAt}</div>
                      <div>{t('lastUpdate')}: {ticket.updatedAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-4 md:mt-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">{t('contactSupport')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center p-4 md:p-6 border rounded-lg">
                <Phone className="h-6 w-6 md:h-8 md:w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-sm md:text-base">{t('phone')}</h3>
                <p className="text-gray-600 text-sm md:text-base">+966 11 123 4567</p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">{t('available24_7')}</p>
              </div>
              
              <div className="text-center p-4 md:p-6 border rounded-lg">
                <Mail className="h-6 w-6 md:h-8 md:w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-sm md:text-base">{t('email')}</h3>
                <p className="text-gray-600 text-sm md:text-base break-all">support@getcar.com</p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">{t('responseIn24h')}</p>
              </div>
              
              <div className="text-center p-4 md:p-6 border rounded-lg">
                <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-sm md:text-base">{t('liveChat')}</h3>
                <button className="bg-primary text-white px-3 md:px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-xs md:text-sm">
                  {t('startChat')}
                </button>
                <p className="text-xs md:text-sm text-gray-500 mt-1">{t('instantSupport')}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportSection;
