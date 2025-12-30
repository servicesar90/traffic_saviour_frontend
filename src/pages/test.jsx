import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

const OPTIONS = [
  { value: "country", label: "Country" },
  { value: "state", label: "State" },
  { value: "zip", label: "Zip Code" },
  { value: "browser", label: "Browser" },
  { value: "referrer", label: "Referrer" },
  { value: "userAgent", label: "User Agent" },
  { value: "isp", label: "ISP" },
];

export default function RuleBuilder() {
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      conditions: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "conditions"
  });

  const selectedTypes = watch("conditions").map(c => c.type);

  const handleAddCondition = (type) => {
    append({
      type,
      mode: "allow",
      values: []
    });
  };

  const onSubmit = (data) => {
 
    // backend ko bhejne layak JSON:
    // [
    //   { type: "country", mode: "allow", values: ["India","US"] },
    //   { type: "browser", mode: "block", values: ["Chrome"] }
    // ]
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      {/* Add Condition Dropdown */}
      <select
        onChange={(e) => {
          if (e.target.value) {
            handleAddCondition(e.target.value);
            e.target.value = ""; // reset
          }
        }}
      >
        <option value="">-- Add Condition --</option>
        {OPTIONS.filter(o => !selectedTypes.includes(o.value)).map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Remove All */}
      {fields.length > 0 && (
        <button type="button" onClick={() => reset({ conditions: [] })}>
          Remove All
        </button>
      )}

      <div style={{ marginTop: "20px" }}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
          >
            <h4>{field.type.toUpperCase()}</h4>

            {/* Allow / Block */}
            <Controller
              control={control}
              name={`conditions.${index}.mode`}
              render={({ field }) => (
                <div>
                  <label>
                    <input
                      type="radio"
                      value="allow"
                      checked={field.value === "allow"}
                      onChange={field.onChange}
                    />
                    Allow
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="block"
                      checked={field.value === "block"}
                      onChange={field.onChange}
                    />
                    Block
                  </label>
                </div>
              )}
            />

            {/* Values Input */}
            <Controller
              control={control}
              name={`conditions.${index}.values`}
              render={({ field }) => (
                <div>
                  {field.value.map((val, i) => (
                    <span key={i} style={{ marginRight: "5px" }}>
                      {val}
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange(field.value.filter((_, idx) => idx !== i))
                        }
                      >
                        x
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={`Enter ${field.type}...`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        e.preventDefault();
                        field.onChange([...field.value, e.target.value.trim()]);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              )}
            />

            {/* Remove single condition */}
            <button type="button" onClick={() => remove(index)}>Remove</button>
          </div>
        ))}
      </div>

      {fields.length > 0 && <button type="submit">Submit</button>}
    </form>
  );
}
