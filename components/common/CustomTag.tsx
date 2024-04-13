import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';

interface Props {
   tag: string;
   onDelete: () => React.Dispatch<React.SetStateAction<string[]>> | void;
}

export const CustomTag = (props: Props) => {
   const { tag, onDelete } = props;

   return (
      <div className="custom-tag">
         <span>{tag}</span>
         <button onClick={() => onDelete()}>
            <ClearIcon fontSize="small" />
         </button>
      </div>
   );
};
