import React from 'react';

interface Props {
   name: string;
   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
   value?: string;
   label?: string;
}

const CustomInputDate = (props: Props) => {
   const { name, onChange, value, label } = props;
   return (
      <div className="custom-input-date-wrapper">
         {label && <label htmlFor={name}>{label}</label>}
         <input
            type="date"
            name={name}
            id={name}
            onChange={onChange}
            value={value}
            className="custom-input-date" // Aquí puedes agregar tus estilos personalizados
         />
      </div>
   );
};

export default CustomInputDate;
