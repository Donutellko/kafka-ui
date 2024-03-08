import React from 'react';
import { render, WithRoute } from 'lib/testHelpers';
import { screen } from '@testing-library/react';
import { clusterTopicAclsPath } from 'lib/paths';
import { useTopicACLs } from 'lib/hooks/api/topics';
import { KafkaAcl } from 'generated-sources';
import { topicAcls } from 'lib/fixtures/topics';
import TopicACLs from 'components/Topics/Topic/ACL/TopicACLs';

const clusterName = 'local';
const topicName = 'my-topicName';
const path = clusterTopicAclsPath(clusterName, topicName);

jest.mock('lib/hooks/api/topics', () => ({
  useTopicACLs: jest.fn(),
}));

describe('TopicACLs', () => {
  const renderComponent = async (payload?: KafkaAcl[]) => {
    (useTopicACLs as jest.Mock).mockImplementation(() => ({
      data: payload,
    }));

    render(
      <WithRoute path={clusterTopicAclsPath()}>
        <TopicACLs />
      </WithRoute>,
      { initialEntries: [path] }
    );
  };

  it('renders empty table if acls payload is empty', async () => {
    await renderComponent([]);
    expect(screen.getByText('No ACL items found')).toBeInTheDocument();
  });

  it('renders empty table if acl payload is undefined', async () => {
    await renderComponent();
    expect(screen.getByText('No ACL items found')).toBeInTheDocument();
  });

  it('renders table of aclss', async () => {
    await renderComponent(topicAcls);
    expect(screen.getAllByRole('row').length).toEqual(3);
  });
});
