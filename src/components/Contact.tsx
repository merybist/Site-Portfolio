import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle',
  );
  const [statusMessage, setStatusMessage] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setFormStatus('sending');
  setStatusMessage('');

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error('Failed to send message');
    }

    setFormStatus('success');
    setStatusMessage('Message sent! I will reply soon.');
    setFormData({ name: '', email: '', message: '' });
  } catch (err) {
    setFormStatus('error');
    setStatusMessage('Failed to send message. Try again later.');
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="mb-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent-blue font-mono text-lg md:text-xl">05.</span>{' '}
            <span className="bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full mx-auto" />
          <p className="text-text-secondary mt-6 text-lg">
            I'm always open to new opportunities and interesting projects.
            <br />
            Feel free to reach out!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeInOut' }}
          className="bg-secondary border border-border rounded-lg p-6 sm:p-8 mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-text-primary font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue transition-colors duration-300"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-text-primary font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue transition-colors duration-300"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-text-primary font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue transition-colors duration-300 resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              disabled={formStatus === 'sending'}
              className="w-full px-8 py-4 bg-accent-blue text-white font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-blue/50 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            {statusMessage && (
              <p
                className={`text-sm ${
                  formStatus === 'success' ? 'text-accent-green' : 'text-accent-purple'
                }`}
              >
                {statusMessage}
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
