import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Contact } from '../Contact';
import * as api from '../../../services/api';

vi.mock('../../../services/api');

const renderContact = () => {
  return render(
    <LazyMotion features={domAnimation}>
      <Contact />
    </LazyMotion>
  );
};

describe('Contact Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section heading with mail ankit command and accessible inputs', async () => {
    renderContact();
    await waitFor(() => {
      expect(screen.getByText('mail ankit')).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('validates empty inputs on submit and associates errors with inputs via aria-describedby', async () => {
    renderContact();

    const submitBtn = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAttribute('aria-describedby', 'contact-name-error');
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-describedby', 'contact-email-error');
    expect(messageInput).toHaveAttribute('aria-invalid', 'true');
    expect(messageInput).toHaveAttribute('aria-describedby', 'contact-message-error');

    // Focus should move to the first invalid field
    expect(document.activeElement).toBe(nameInput);
    expect(api.submitContact).not.toHaveBeenCalled();
  });

  it('validates invalid email format and length limits', async () => {
    renderContact();

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    // Too short name, invalid email, too short message
    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.change(messageInput, { target: { value: 'short' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/name must be 2-100 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/valid email required/i)).toBeInTheDocument();
    expect(screen.getByText(/message must be 10-2000 characters/i)).toBeInTheDocument();
    expect(api.submitContact).not.toHaveBeenCalled();
  });

  it('handles successful submission and renders terminal confirmation', async () => {
    api.submitContact.mockResolvedValueOnce({
      data: { success: true, message: 'Message sent successfully!' },
    });

    renderContact();

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Alice Smith' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Hello Ankit, I would like to discuss a project with you.' },
    });

    const submitBtn = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/message sent\. I will reply by email\./i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /\$ mail --again/i })).toBeInTheDocument();
    });
  });

  it('prevents double submission while sending (disabled submit button)', async () => {
    // Keep pending
    let resolvePromise;
    api.submitContact.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    renderContact();

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Bob Jones' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bob@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Hello Ankit, this is a test message to verify button disabling.' },
    });

    const submitBtn = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitBtn);

    // Button is disabled and indicates sending
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/sending\.\.\./i)).toBeInTheDocument();

    // Second click does not trigger another API call
    fireEvent.click(submitBtn);
    expect(api.submitContact).toHaveBeenCalledTimes(1);

    resolvePromise({ data: { success: true } });
    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();
    });
  });

  it('handles 429 rate limit error gracefully', async () => {
    const rateLimitErr = new Error('Rate limit exceeded');
    rateLimitErr.response = { status: 429 };
    api.submitContact.mockRejectedValueOnce(rateLimitErr);

    renderContact();

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Carol Danvers' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'carol@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Testing rate limit error response handling in contact form.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/too many messages, try later\./i)).toBeInTheDocument();
    });
  });

  it('handles server error (500) gracefully without showing raw stack or text', async () => {
    const serverErr = new Error('Internal Server Error 500');
    serverErr.response = { status: 500, data: { message: 'Database connection failed' } };
    api.submitContact.mockRejectedValueOnce(serverErr);

    renderContact();

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Dave Clark' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'dave@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Testing 500 internal server error handling.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/unable to send message\. Please try again later\./i)
      ).toBeInTheDocument();
      // Raw error message should NOT be displayed
      expect(screen.queryByText(/Database connection failed/i)).not.toBeInTheDocument();
    });
  });

  it('handles network failure gracefully', async () => {
    api.submitContact.mockRejectedValueOnce(new Error('Network Error'));

    renderContact();

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Eve Adams' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'eve@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Testing offline network error handling.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/network unavailable\. Please check your connection\./i)
      ).toBeInTheDocument();
    });
  });

  it('ensures no rendered direct link has href="#" or unconfirmed placeholder as anchor', () => {
    const { container } = renderContact();
    const links = container.querySelectorAll('a');

    links.forEach((link) => {
      const href = link.getAttribute('href');
      expect(href).not.toBe('#');
      expect(href).not.toBe('');
      expect(href).not.toBeNull();
      expect(href).not.toContain('[' + 'FILL');
    });
  });
});
