import FormLabel from "../purchase/FormLabel";

const FormInput = ({ type, placeholder, label, name, onChange, value, editable }) => {
  const isEditable = editable === true || editable === null || editable === undefined;

  return (
    <div className="flex flex-col">
      {label && <FormLabel title={label} />}
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={!isEditable} // Correct way to make input non-editable
        className="bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default FormInput;
