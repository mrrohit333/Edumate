"use client"

import { useState } from 'react';

export const AboutContent = () => {
  return (
    <div>
      <p className="mb-4">
        EduMate is an innovative AI-powered English learning platform designed to help students master the
        English language through interactive and personalized learning experiences.
      </p>
      <p className="mb-4">
        Founded in 2023, our mission is to make English learning accessible, engaging, and effective for
        students of all backgrounds. We combine cutting-edge AI technology with proven language learning
        methodologies to create a unique learning experience.
      </p>
      <p className="mb-4">
        Our 3D AI instructor adapts to your learning style, providing real-time feedback and personalized
        lessons based on your progress. Whether you're preparing for an interview, improving your
        pronunciation, or learning from documents, EduMate is your companion on your English learning journey.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-3">Our Vision</h3>
      <p className="mb-4">
        To revolutionize English language education through AI-powered personalized learning, making fluency
        attainable for everyone around the globe.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-3">Our Team</h3>
      <p className="mb-4">
        EduMate was created by a team of language experts, AI researchers, and education specialists who are
        passionate about transforming the way people learn English. Our diverse team brings together expertise
        from various fields to create an effective and engaging learning platform.
      </p>
    </div>
  );
};

export const BlogContent = () => {
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">5 Ways AI is Transforming Language Learning</h3>
        <p className="text-sm text-muted-foreground mb-2">Posted on May 5, 2023</p>
        <p>
          Artificial Intelligence is revolutionizing how we learn languages. From personalized learning paths
          to real-time pronunciation feedback, discover how AI is making language acquisition faster and more
          effective.
        </p>
        <a href="#" className="text-primary hover:underline mt-2 inline-block">
          Read more →
        </a>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Mastering English for Job Interviews: A Complete Guide</h3>
        <p className="text-sm text-muted-foreground mb-2">Posted on April 12, 2023</p>
        <p>
          Job interviews in English can be intimidating, even for advanced learners. This comprehensive guide
          covers common interview questions, appropriate vocabulary, and tips for conveying confidence in your
          second language.
        </p>
        <a href="#" className="text-primary hover:underline mt-2 inline-block">
          Read more →
        </a>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">The Science Behind Effective Language Acquisition</h3>
        <p className="text-sm text-muted-foreground mb-2">Posted on March 20, 2023</p>
        <p>
          What makes some language learning methods more effective than others? This article explores the
          cognitive science behind language acquisition and how EduMate incorporates these principles into its
          learning methodology.
        </p>
        <a href="#" className="text-primary hover:underline mt-2 inline-block">
          Read more →
        </a>
      </div>
      
      <div className="text-center mt-6">
        <a href="#" className="text-primary hover:underline font-medium">
          View all blog posts →
        </a>
      </div>
    </div>
  );
};

export const CareersContent = () => {
  return (
    <div>
      <p className="mb-6">
        Join our innovative team at EduMate and help transform how people learn English. We're looking for
        passionate individuals who are excited about education, AI, and making a positive impact on learners
        worldwide.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Open Positions</h3>
      
      <div className="border rounded-lg p-4 mb-4">
        <h4 className="font-medium mb-1">AI Research Scientist</h4>
        <p className="text-sm text-muted-foreground mb-2">Full-time • Remote</p>
        <p className="mb-2">
          We're looking for an AI Research Scientist to help improve our language learning algorithms and
          develop new features for our 3D AI instructor.
        </p>
        <a href="#" className="text-primary hover:underline text-sm">
          Learn more →
        </a>
      </div>
      
      <div className="border rounded-lg p-4 mb-4">
        <h4 className="font-medium mb-1">UX/UI Designer</h4>
        <p className="text-sm text-muted-foreground mb-2">Full-time • Hybrid</p>
        <p className="mb-2">
          Join our design team to create intuitive, engaging user experiences that make language learning
          enjoyable and effective.
        </p>
        <a href="#" className="text-primary hover:underline text-sm">
          Learn more →
        </a>
      </div>
      
      <div className="border rounded-lg p-4 mb-4">
        <h4 className="font-medium mb-1">Content Developer</h4>
        <p className="text-sm text-muted-foreground mb-2">Full-time • Remote</p>
        <p className="mb-2">
          Create engaging educational content for English learners at various proficiency levels.
        </p>
        <a href="#" className="text-primary hover:underline text-sm">
          Learn more →
        </a>
      </div>
      
      <p className="mt-6">
        Don't see a position that matches your skills? We're always looking for talented individuals.
        Send your resume to <a href="mailto:careers@edumate.com" className="text-primary hover:underline">careers@edumate.com</a>.
      </p>
    </div>
  );
};

export const ContactContent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        setSubmitStatus({
          type: 'error',
          message: 'Please fill in all fields'
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Your message has been sent successfully!'
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Something went wrong. Please try again later.'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <p className="mb-6">
        We'd love to hear from you! Whether you have questions about EduMate, need technical support, or want
        to explore partnership opportunities, our team is here to help.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
          <p className="mb-2">
            Having trouble with your account or have questions about our features?
          </p>
          <p className="mb-4">
            Email: <a href="mailto:edumatepartner@gmail.com" className="text-primary hover:underline">support@edumate.com</a>
          </p>
          <p>
            Response time: Within 24 hours
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Business Inquiries</h3>
          <p className="mb-2">
            Interested in partnering with EduMate or exploring enterprise solutions?
          </p>
          <p className="mb-4">
            Email: <a href="mailto:edumatepartner@gmail.com" className="text-primary hover:underline">business@edumate.com</a>
          </p>
          <p>
            Phone: +91 6383848060
          </p>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
      
      {submitStatus && (
        <div className={`p-4 mb-4 border rounded-md ${submitStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {submitStatus.message}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Your name"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Your email"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Subject"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Your message"
            disabled={isSubmitting}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export const PrivacyPolicyContent = () => {
  return (
    <div>
      <p className="mb-6">
        Last updated: June 1, 2023
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h3>
      <p className="mb-4">
        EduMate ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h3>
      <p className="mb-2">We may collect the following types of information:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Personal Information: Name, email address, and contact details provided during registration</li>
        <li>Usage Data: Information on how you interact with our platform</li>
        <li>Learning Data: Your progress, performance, and learning patterns</li>
        <li>Voice Data: Audio recordings for pronunciation assessment</li>
        <li>Document Data: Content from documents you upload for learning purposes</li>
      </ul>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h3>
      <p className="mb-2">We use your information for the following purposes:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>To provide and maintain our services</li>
        <li>To personalize your learning experience</li>
        <li>To improve our platform and develop new features</li>
        <li>To communicate with you about updates, support, and promotional offers</li>
        <li>To ensure the security of our platform</li>
      </ul>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">4. Data Sharing and Disclosure</h3>
      <p className="mb-4">
        We do not sell your personal information. We may share data with third-party service providers who help us operate our platform, but they are obligated to keep your information confidential.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">5. Your Rights</h3>
      <p className="mb-2">Depending on your location, you may have the right to:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Access and receive a copy of your personal data</li>
        <li>Rectify inaccurate personal data</li>
        <li>Request deletion of your personal data</li>
        <li>Restrict processing of your personal data</li>
        <li>Data portability</li>
        <li>Object to processing of your personal data</li>
      </ul>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">6. Data Security</h3>
      <p className="mb-4">
        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">7. Contact Us</h3>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, please contact us at:
        <a href="mailto:privacy@edumate.com" className="text-primary hover:underline ml-1">privacy@edumate.com</a>
      </p>
    </div>
  );
};

export const TermsOfServiceContent = () => {
  return (
    <div>
      <p className="mb-6">
        Last updated: June 1, 2023
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h3>
      <p className="mb-4">
        By accessing or using EduMate's website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h3>
      <p className="mb-4">
        EduMate provides an AI-powered English learning platform with various features including voice-guided learning, PDF summarization, interview preparation, and grammar correction. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">3. User Accounts</h3>
      <p className="mb-4">
        To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">4. User Content</h3>
      <p className="mb-4">
        By uploading content to our platform, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute your content solely for the purpose of providing our services to you.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">5. Prohibited Conduct</h3>
      <p className="mb-2">You agree not to:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Violate any applicable laws or regulations</li>
        <li>Infringe on the rights of others</li>
        <li>Upload harmful content or malware</li>
        <li>Attempt to gain unauthorized access to our systems</li>
        <li>Use our services for any illegal purposes</li>
      </ul>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">6. Intellectual Property Rights</h3>
      <p className="mb-4">
        All content, features, and functionality of our platform are owned by EduMate and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our permission.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">7. Limitation of Liability</h3>
      <p className="mb-4">
        EduMate shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">8. Termination</h3>
      <p className="mb-4">
        We may terminate or suspend your account for violations of these Terms of Service. You may also terminate your account at any time by contacting us.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">9. Changes to Terms</h3>
      <p className="mb-4">
        We reserve the right to modify these Terms of Service at any time. We will notify you of any significant changes by posting the new terms on our website.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">10. Contact Us</h3>
      <p className="mb-4">
        If you have any questions about these Terms of Service, please contact us at:
        <a href="mailto:legal@edumate.com" className="text-primary hover:underline ml-1">legal@edumate.com</a>
      </p>
    </div>
  );
};

export const CookiePolicyContent = () => {
  return (
    <div className="text-base">
      <p className="mb-6">
        Last updated: June 1, 2023
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">1. What Are Cookies?</h3>
      <p className="mb-4">
        Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by enabling certain features, remembering your preferences, and helping us understand how users interact with our site.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">2. Types of Cookies We Use</h3>
      <div className="mb-4 space-y-4">
        <div>
          <h4 className="font-medium mb-1">Essential Cookies</h4>
          <p className="mb-2">
            These cookies are necessary for the website to function properly and cannot be switched off. They are usually set in response to actions made by you such as logging in or filling in forms.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-1">Performance Cookies</h4>
          <p className="mb-2">
            These cookies collect information about how visitors use our website, such as which pages are visited most often. They help us improve how our website works.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-1">Functionality Cookies</h4>
          <p className="mb-2">
            These cookies allow the website to remember choices you make and provide enhanced, personalized features.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-1">Targeting Cookies</h4>
          <p className="mb-2">
            These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant ads on other sites.
          </p>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">3. Managing Cookies</h3>
      <p className="mb-4">
        You can control and manage cookies in various ways. Most web browsers allow you to manage your cookie preferences. You can:
      </p>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Delete cookies from your device</li>
        <li>Block cookies by activating the setting on your browser that allows you to refuse all or some cookies</li>
        <li>Set your browser to notify you when you receive a cookie</li>
      </ul>
      <p className="mb-4">
        Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, and some services may not function properly.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">4. Changes to Our Cookie Policy</h3>
      <p className="mb-4">
        We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">5. Contact Us</h3>
      <p className="mb-4">
        If you have any questions about our Cookie Policy, please contact us at:
        <a href="mailto:privacy@edumate.com" className="text-primary hover:underline ml-1">privacy@edumate.com</a>
      </p>
    </div>
  );
}; 