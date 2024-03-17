import userEvent from '@testing-library/user-event';
import { act, screen } from '@testing-library/react';
import { render } from 'lib/testHelpers';
import React from 'react';
import PreviewFields, {
  InfoModalProps,
} from 'components/Topics/Topic/Messages/PreviewFields';

jest.mock('components/common/Icons/CloseIcon', () => () => 'mock-CloseIcon');

const toggleInfoModal = jest.fn();

const renderComponent = (props?: Partial<InfoModalProps>) => {
  render(
    <PreviewFields
      toggleIsOpen={toggleInfoModal}
      values={[]}
      setFilters={jest.fn()}
      {...props}
      messageFields={['type']}
    />
  );
};

describe('PreviewFields component', () => {
  it('closes PreviewFields', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: 'Accept' }));
    expect(toggleInfoModal).toHaveBeenCalledTimes(1);
  });

  it('return if empty inputs', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('Json path is required')).toBeInTheDocument();
    // expect(screen.getByText('Field is required')).toBeInTheDocument();
  });

  describe('Input elements', () => {
    const fieldValue = 'type';
    // const pathValue = 'schema.type';
    const setFilters = jest.fn();
    beforeEach(async () => {
      await act(() => {
        renderComponent({ setFilters });
      });
    });
    it('field input', async () => {
      const fieldInput = screen.getByPlaceholderText('Display Name');
      expect(fieldInput).toHaveValue('');
      await userEvent.type(fieldInput, fieldValue);
      expect(fieldInput).toHaveValue(fieldValue);
    });
    // it('path input', async () => {
    //   const pathInput = screen.getByPlaceholderText('Json Path');
    //   expect(pathInput).toHaveValue('');
    //   await userEvent.type(pathInput, pathValue);
    //   expect(pathInput).toHaveValue(pathValue.toString());
    // });
    // it('set filters', async () => {
    //   userEvent.click(screen.getByRole('button', { name: 'Add' }));
    //   expect(setFilters).toHaveBeenCalledTimes(1);
    // });
  });

  describe('edit and remove functionality', () => {
    // const fieldValue = 'type new';
    // const pathValue = 'schema.type.new';
    it('remove values', async () => {
      // const setFilters = jest.fn();
      // await act(() => {
      //   renderComponent({ setFilters });
      // });
      // await userEvent.click(screen.getByRole('button', { name: 'Accept' }));
      // expect(setFilters).toHaveBeenCalledTimes(1);
    });
    it('edit values', async () => {
      // const setFilters = jest.fn();
      // const toggleIsOpen = jest.fn();
      // await act(() => {
      //   renderComponent({ setFilters, values: mockValues });
      // });
      // userEvent.click(screen.getByRole('button', { name: 'Edit' }));
      // const fieldInput = screen.getByPlaceholderText('Field');
      // userEvent.type(fieldInput, fieldValue);
      // const pathInput = screen.getByPlaceholderText('Json Path');
      // userEvent.type(pathInput, pathValue);
      // userEvent.click(screen.getByRole('button', { name: 'Save' }));
      // await act(() => {
      //   renderComponent({ setFilters, toggleIsOpen });
      // });
    });
  });
});
