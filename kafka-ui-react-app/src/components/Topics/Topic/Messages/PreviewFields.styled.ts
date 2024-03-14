import styled, { css } from 'styled-components';
import CloseIcon from 'components/common/Icons/CloseIcon';
import EditIcon from 'components/common/Icons/EditIcon';

export const PreviewFields = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h4 {
    margin-bottom: 4px;
  }
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: right;
  padding-top: 20px;
  gap: 10px;
  border-top: 1px solid #f1f2f3;
`;

export const EditForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 8px;
  margin-bottom: 4px;
  height: 40px;
  color: ${({ theme }) => theme.activeFilter.color};
  background: ${({ theme }) => theme.activeFilter.backgroundColor};
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
`;

export const Field = styled.div`
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 5px;
  color: ${({ theme }) => theme.modal.color};
`;

export const EditFilterIcon = styled.div(
  ({ theme: { icons } }) => css`
    color: ${icons.editIcon.normal};
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 32px;
    cursor: pointer;

    &:hover {
      ${EditIcon} {
        fill: ${icons.editIcon.hover};
      }
    }

    &:active {
      ${EditIcon} {
        fill: ${icons.editIcon.active};
      }
    }
  `
);

export const DeleteFilterIcon = styled.div(
  ({ theme: { icons } }) => css`
    color: ${icons.closeIcon.normal};
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 32px;
    cursor: pointer;

    svg {
      height: 14px;
      width: 14px;
    }

    &:hover {
      ${CloseIcon} {
        fill: ${icons.closeIcon.hover};
      }
    }

    &:active {
      ${CloseIcon} {
        fill: ${icons.closeIcon.active};
      }
    }
  `
);
