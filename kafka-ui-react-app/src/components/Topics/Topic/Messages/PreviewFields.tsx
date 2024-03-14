import React, { useEffect } from 'react';
import { Button } from 'components/common/Button/Button';
import { FormError } from 'components/common/Input/Input.styled';
import Input from 'components/common/Input/Input';
import { InputLabel } from 'components/common/Input/InputLabel.styled';
import IconButtonWrapper from 'components/common/Icons/IconButtonWrapper';
import EditIcon from 'components/common/Icons/EditIcon';
import CloseIcon from 'components/common/Icons/CloseIcon';
import Heading from 'components/common/heading/Heading.styled';

import * as S from './PreviewFields.styled';
import { PreviewFilter } from './Message';

export interface InfoModalProps {
  values: PreviewFilter[];
  toggleIsOpen(): void;
  setFilters: (payload: PreviewFilter[]) => void;
}

const PreviewFields: React.FC<InfoModalProps> = ({
  values,
  toggleIsOpen,
  setFilters,
}) => {
  const [field, setField] = React.useState('');
  const [path, setPath] = React.useState('');
  const [errors, setErrors] = React.useState<string[]>([]);
  const [editIndex, setEditIndex] = React.useState<number | undefined>();
  const [showAddField, setShowAddField] = React.useState(false);

  const handleAccept = () => {
    toggleIsOpen();
  };

  const resetAddField = () => {
    setField('');
    setPath('');
    setShowAddField(false);
  };

  const handleOk = () => {
    const newErrors = [];

    if (field === '') {
      newErrors.push('field');
    }

    if (path === '') {
      newErrors.push('path');
    }

    if (newErrors?.length) {
      setErrors(newErrors);
      return;
    }

    const newValues = [...values];

    if (typeof editIndex !== 'undefined') {
      newValues.splice(editIndex, 1, { field, path });
    } else {
      newValues.push({ field, path });
    }

    resetAddField();
    setFilters(newValues);
  };

  const handleRemove = (filter: PreviewFilter) => {
    const newValues = values.filter(
      (item) => item.field !== filter.field && item.path !== filter.path
    );

    setFilters(newValues);
  };

  const handleEditIndex = (index: number) => {
    setEditIndex(index);
    setShowAddField(true);
  };

  useEffect(() => {
    if (values?.length && typeof editIndex !== 'undefined') {
      setField(values[editIndex].field);
      setPath(values[editIndex].path);
    }
  }, [editIndex]);

  return (
    <S.PreviewFields>
      <div>
        {values.map((item, index) => (
          <S.EditForm key="index">
            <S.Field>
              {' '}
              {item.field} : {item.path}
            </S.Field>
            <S.EditFilterIcon
              role="button"
              onClick={() => handleEditIndex(index)}
            >
              <EditIcon />
            </S.EditFilterIcon>
            {'  '}
            <S.DeleteFilterIcon
              role="button"
              onClick={() => handleRemove(item)}
            >
              <CloseIcon />
            </S.DeleteFilterIcon>
          </S.EditForm>
        ))}
        {!showAddField && values.length > 0 && (
          <Button
            buttonSize="M"
            buttonType="primary"
            isInverted
            type="button"
            onClick={() => setShowAddField(true)}
          >
            Add Field Preview
          </Button>
        )}
        {(showAddField || values.length === 0) && (
          <div>
            <Heading level={4}>
              {typeof editIndex !== 'undefined' ? 'Edit' : 'Add'} Field
            </Heading>
            <div>
              <InputLabel htmlFor="previewFormField">Field</InputLabel>
              <Input
                type="text"
                id="previewFormField"
                min="1"
                value={field}
                placeholder="Field"
                onChange={({ target }) => setField(target?.value)}
              />
              <FormError>
                {errors.includes('field') && 'Field is required'}
              </FormError>
            </div>
            <div>
              <InputLabel htmlFor="previewFormJsonPath">Json path</InputLabel>
              <Input
                type="text"
                id="previewFormJsonPath"
                min="1"
                value={path}
                placeholder="Json Path"
                onChange={({ target }) => setPath(target?.value)}
              />
              <FormError>
                {errors.includes('path') && 'Json path is required'}
              </FormError>
            </div>
            <S.ButtonWrapper>
              {values.length > 0 && (
                <Button
                  buttonSize="M"
                  buttonType="primary"
                  isInverted
                  type="button"
                  onClick={() => resetAddField()}
                >
                  Cancel
                </Button>
              )}
              <Button
                buttonSize="M"
                buttonType="secondary"
                type="button"
                onClick={handleOk}
              >
                {typeof editIndex !== 'undefined' ? 'Save Changes' : 'Add'}
              </Button>
            </S.ButtonWrapper>
          </div>
        )}
      </div>
      <S.ButtonWrapper>
        <Button
          buttonSize="M"
          buttonType="secondary"
          type="button"
          onClick={handleAccept}
        >
          Accept
        </Button>
      </S.ButtonWrapper>
    </S.PreviewFields>
  );
};

export default PreviewFields;
