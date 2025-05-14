import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';

const ContactSection = styled.section`
  background-color: ${({ theme }) => theme.colors.lightGray};
  padding: 100px 0;
`;

const ContactContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.darkGray};
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
`;

const ContactContent = styled.div`
  display: flex;
  gap: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const ContactInfo = styled(motion.div)`
  flex: 1;
`;

const ContactForm = styled(motion.div)`
  flex: 1;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const InfoTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
`;

const InfoItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InfoItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const InfoIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
`;

const InfoContent = styled.div``;

const InfoLabel = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.3rem;
`;

const InfoValue = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.darkGray};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  transition: all ${({ theme }) => theme.transitions.medium};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-3px);
  }
`;

const FormTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  transition: border-color ${({ theme }) => theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  resize: vertical;
  min-height: 150px;
  transition: border-color ${({ theme }) => theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all ${({ theme }) => theme.transitions.medium};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-3px);
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.darkGray};
    cursor: not-allowed;
    transform: none;
  }
`;

const FormMessage = styled.div<{ isSuccess: boolean }>`
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ isSuccess, theme }) => 
    isSuccess ? theme.colors.success + '20' : theme.colors.error + '20'};
  color: ${({ isSuccess, theme }) => 
    isSuccess ? theme.colors.success : theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ text: string; success: boolean } | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormMessage({
        text: 'Your message has been sent successfully! I will get back to you soon.',
        success: true,
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormMessage(null);
      }, 5000);
    }, 1500);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  
  return (
    <ContactSection id="contact">
      <ContactContainer>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
        </SectionTitle>
        <SectionSubtitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Feel free to contact me for any project or collaboration
        </SectionSubtitle>
        
        <ContactContent>
          <ContactInfo
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <InfoTitle>Contact Information</InfoTitle>
            <InfoText>
              I'm open for freelance projects, full-time positions, and collaborations. Feel free to reach out if you have any questions or just want to say hello!
            </InfoText>
            
            <InfoItems>
              <InfoItem
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <InfoIcon>
                  <IconWrapper icon={FaMapMarkerAlt} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Location</InfoLabel>
                  <InfoValue>Berlin, Germany</InfoValue>
                </InfoContent>
              </InfoItem>
              
              <InfoItem
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <InfoIcon>
                  <IconWrapper icon={FaEnvelope} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>contact@example.com</InfoValue>
                </InfoContent>
              </InfoItem>
              
              <InfoItem
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <InfoIcon>
                  <IconWrapper icon={FaPhone} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Phone</InfoLabel>
                  <InfoValue>+49 123 456 7890</InfoValue>
                </InfoContent>
              </InfoItem>
            </InfoItems>
          </ContactInfo>
          
          <ContactForm
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <FormTitle>Send Me a Message</FormTitle>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="subject">Subject</FormLabel>
                <FormInput
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="message">Message</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <SubmitButton
                type="submit"
                disabled={isSubmitting}
                whileHover={{ y: -3 }}
                whileTap={{ y: 0 }}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    Send Message <IconWrapper icon={FaPaperPlane} />
                  </>
                )}
              </SubmitButton>
              
              {formMessage && (
                <FormMessage isSuccess={formMessage.success}>
                  {formMessage.text}
                </FormMessage>
              )}
            </form>
          </ContactForm>
        </ContactContent>
      </ContactContainer>
    </ContactSection>
  );
};

export default Contact;
