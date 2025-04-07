const SelectFilter = ({ value, onChange, options }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default SelectFilter;
