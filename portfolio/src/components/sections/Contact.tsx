import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPaperPlane, FaBook } from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';
import { portfolioPath } from '../../config/siteConfig';

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
  background-color: var(--surface-color);
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
  background-color: var(--surface-2-color);
  color: var(--text-color);
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  transition: border-color ${({ theme }) => theme.transitions.short};

  &::placeholder {
    color: ${({ theme }) => theme.colors.darkGray};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: var(--surface-2-color);
  color: var(--text-color);
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  resize: vertical;
  min-height: 150px;
  transition: border-color ${({ theme }) => theme.transitions.short};

  &::placeholder {
    color: ${({ theme }) => theme.colors.darkGray};
  }
  
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

const PrivacyNote = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: ${({ theme }) => theme.fontSizes.small};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
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

    const subject = encodeURIComponent(`[Portfolio] ${formData.subject}`);
    const body = encodeURIComponent(
      `Hi Bogdan,\n\n${formData.message}\n\nFrom: ${formData.name}\nReply to: ${formData.email}`
    );
    window.location.href = `mailto:bogdanfemic07@gmail.com?subject=${subject}&body=${body}`;
    setIsSubmitting(false);
    setFormMessage({
      text: 'Your email application should now be open. The website has not sent or stored your message.',
      success: true,
    });
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
              I'm open for collaborations, internships, and frontend work. Feel free to reach out if you want to discuss a project, a role, or just compare notes on interfaces and product design.
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
                  <InfoValue>Frankfurt, Hessen, Germany</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <InfoIcon>
                  <IconWrapper icon={FaBook} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Academic focus</InfoLabel>
                  <InfoValue>Computer Science at TU Darmstadt</InfoValue>
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
                  <InfoValue>bogdanfemic07@gmail.com</InfoValue>
                </InfoContent>
              </InfoItem>
                            

              {/* <InfoItem
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
              </InfoItem> */}
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
                {isSubmitting ? 'Opening...' : (
                  <>
                    Open Email App <IconWrapper icon={FaPaperPlane} />
                  </>
                )}
              </SubmitButton>
              
              {formMessage && (
                <FormMessage isSuccess={formMessage.success} role="status" aria-live="polite">
                  {formMessage.text}
                </FormMessage>
              )}
              <PrivacyNote>
                This form opens your email application; it does not send data to a website server. See the <a href={portfolioPath('datenschutz')}>privacy notice</a>.
              </PrivacyNote>
            </form>
          </ContactForm>
        </ContactContent>
      </ContactContainer>
    </ContactSection>
  );
};

export default Contact;
