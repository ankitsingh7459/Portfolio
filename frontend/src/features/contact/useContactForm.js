import { useState, useRef } from 'react';
import { submitContact } from '../../services/api';

/**
 * Validates contact input fields according to backend constraints:
 * - name: 2-100 characters
 * - email: valid email format
 * - message: 10-2000 characters
 */
export const validateContact = ({ name, email, message }) => {
  const errors = {};
  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();
  const trimmedMessage = (message || '').trim();

  if (!trimmedName) {
    errors.name = 'Name is required';
  } else if (trimmedName.length < 2 || trimmedName.length > 100) {
    errors.name = 'Name must be 2-100 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Valid email required';
  }

  if (!trimmedMessage) {
    errors.message = 'Message is required';
  } else if (trimmedMessage.length < 10 || trimmedMessage.length > 2000) {
    errors.message = 'Message must be 10-2000 characters';
  }

  return errors;
};

export const useContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | validating | sending | success | error | rate_limited
  const [statusMessage, setStatusMessage] = useState('');

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('validating');
    const validationErrors = validateContact(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('idle');
      // Focus first invalid field
      if (validationErrors.name) {
        nameRef.current?.focus();
      } else if (validationErrors.email) {
        emailRef.current?.focus();
      } else if (validationErrors.message) {
        messageRef.current?.focus();
      }
      return;
    }

    setErrors({});
    setStatus('sending');
    setStatusMessage('');

    try {
      await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      setStatus('success');
      setStatusMessage('message sent. I will reply by email.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      if (err?.response?.status === 429) {
        setStatus('rate_limited');
        setStatusMessage('too many messages, try later.');
      } else if (err?.response) {
        setStatus('error');
        setStatusMessage('unable to send message. Please try again later.');
      } else {
        setStatus('error');
        setStatusMessage('network unavailable. Please check your connection.');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setStatus('idle');
    setStatusMessage('');
  };

  return {
    formData,
    errors,
    status,
    statusMessage,
    nameRef,
    emailRef,
    messageRef,
    handleChange,
    handleSubmit,
    resetForm,
    isSubmitting: status === 'sending',
  };
};

export default useContactForm;
