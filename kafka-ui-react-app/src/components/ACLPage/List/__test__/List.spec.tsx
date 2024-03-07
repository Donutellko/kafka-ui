import React from 'react';
import { render, WithRoute } from 'lib/testHelpers';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { clusterACLPath } from 'lib/paths';
import ACList from 'components/ACLPage/List/List';
import { useAcls, useDeleteAcl } from 'lib/hooks/api/acl';
import { aclPayload } from 'lib/fixtures/acls';

jest.mock('lib/hooks/api/acl', () => ({
  useAcls: jest.fn(),
  useDeleteAcl: jest.fn(),
}));

describe('ACLList Component', () => {
  const clusterName = 'local';
  const renderComponent = () =>
    render(
      <WithRoute path={clusterACLPath()}>
        <ACList />
      </WithRoute>,
      {
        initialEntries: [clusterACLPath(clusterName)],
      }
    );

  describe('ACLList', () => {
    describe('when the acls are loaded', () => {
      beforeEach(() => {
        (useAcls as jest.Mock).mockImplementation(() => ({
          data: aclPayload,
          isSuccess: true,
        }));
        (useDeleteAcl as jest.Mock).mockImplementation(() => ({
          deleteResource: jest.fn(),
        }));
      });

      it('renders ACLList with records', async () => {
        renderComponent();
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getAllByRole('row').length).toEqual(4);
      });

      it('shows delete icon on hover', async () => {
        const { container } = renderComponent();
        const [trElement] = screen.getAllByRole('row');
        await userEvent.hover(trElement);
        const deleteElement = container.querySelector('svg');
        expect(deleteElement).not.toHaveStyle({
          fill: 'transparent',
        });
      });

      it('filters by principal', async () => {
        renderComponent();
        const principalsSpan = screen.getByText('All Principals');
        expect(principalsSpan).toBeInTheDocument();
        await userEvent.click(principalsSpan);
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(4);
        await userEvent.click(options[2]);
        expect(screen.getAllByRole('row').length).toEqual(3);
        await userEvent.click(principalsSpan);
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });

      it('filters by resource type', async () => {
        renderComponent();
        const resourceTypeSpan = screen.getByText('All Resource Types');
        expect(resourceTypeSpan).toBeInTheDocument();
        await userEvent.click(resourceTypeSpan);
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(2);
        await userEvent.click(options[1]);
        expect(screen.getAllByRole('row').length).toEqual(2);
        await userEvent.click(resourceTypeSpan);
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });

      it('filters by resource name', async () => {
        renderComponent();
        const searchbox = screen.getByPlaceholderText(
          'Search by Resource Name'
        );
        expect(searchbox).toBeInTheDocument();
        expect(searchbox).toHaveValue('');

        await userEvent.type(searchbox, 'res');
        expect(searchbox).toHaveValue('res');
      });
    });

    describe('when it has no acls', () => {
      beforeEach(() => {
        (useAcls as jest.Mock).mockImplementation(() => ({
          data: [],
        }));
        (useDeleteAcl as jest.Mock).mockImplementation(() => ({
          deleteResource: jest.fn(),
        }));
      });

      it('renders empty ACLList with message', async () => {
        renderComponent();
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(
          screen.getByRole('row', { name: 'No ACL items found' })
        ).toBeInTheDocument();
      });
    });
  });
});
