import { render, screen } from '@testing-library/react';
import Feedback from "@/app/feedback/page";
import userEvent from '@testing-library/user-event'
import * as EmailService from '@/services/EmailService';
import {act} from "react-dom/test-utils";

jest.mock('@/services/EmailService');
describe('Feedback', () => {
  it('should render the Feedback form', async () => {
    render(<Feedback />);
    expect(screen.getByRole('heading', {name: 'Feedback'})).toBeInTheDocument();
    expect(screen.getByText('Helps us to understand where improvements are needed. Please let us know.')).toBeInTheDocument();
    expect(screen.getByText('Feedback Type:')).toBeInTheDocument();
    expect(screen.getByText('Your Name (Optional):')).toBeInTheDocument();
    expect(screen.getByText('Email Address:')).toBeInTheDocument();
    expect(screen.getByText('Your Feedback:')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Submit'})).toBeInTheDocument();
  });

  it('should see the success alert after submission', async() => {
    const user = userEvent.setup()
    render(<Feedback />);
    jest.spyOn(EmailService, 'sendFeedback').mockResolvedValue({
      resultCode: 'SUCCESS',
      recipient: 'string',
      from: 'string',
      subject: 'string',
      text: 'string'
    });
    // Wait for the success alert to appear
    await act(async () => {
      await user.type(screen.getByText('Your Feedback:'), 'This is a to test if the success alert shows.');
      await user.click(screen.getByRole('button', {name: 'Submit'}));
    });

    expect(screen.getByText('Your feedback has successfully been submitted.')).toBeInTheDocument();
  });

  it('should see the error alert after submission', async() => {
    const user = userEvent.setup()
    render(<Feedback />);
    jest.spyOn(EmailService, 'sendFeedback').mockResolvedValue({
      resultCode: 'ERROR',
      recipient: 'string',
      from: 'string',
      subject: 'string',
      text: 'string'
    });
    // Wait for the error alert to appear
    await act(async () => {
      await user.type(screen.getByText('Your Feedback:'), 'Short message to test if the error alert shows.');
      await user.click(screen.getByRole('button', {name: 'Submit'}));
    });

    expect(screen.getByText('Email feedback was unsuccessful. Please try again.')).toBeInTheDocument();
  });
});
