import { useState } from 'react';
import Button from './Button';
import Input from './Input';
import { validateRequired, validatePhone, validatePostalCode } from '../utils/validators';

// Reusable address form component
export default function AddressForm({
  initialData = {},
  onSubmit,
  isLoading = false,
  submitText = 'Save Address',
}) {
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || '',
    phone: initialData.phone || '',
    address_line: initialData.address_line || '',
    city: initialData.city || '',
    postal_code: initialData.postal_code || '',
    country: initialData.country || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateRequired(formData.full_name)) {
      newErrors.full_name = 'Full name is required';
    }
    if (!validateRequired(formData.phone)) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!validateRequired(formData.address_line)) {
      newErrors.address_line = 'Address is required';
    }
    if (!validateRequired(formData.city)) {
      newErrors.city = 'City is required';
    }
    if (!validateRequired(formData.postal_code)) {
      newErrors.postal_code = 'Postal code is required';
    } else if (!validatePostalCode(formData.postal_code)) {
      newErrors.postal_code = 'Invalid postal code';
    }
    if (!validateRequired(formData.country)) {
      newErrors.country = 'Country is required';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          error={errors.full_name}
          placeholder="John Doe"
          required
        />
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="+92-300-1234567"
          required
        />
      </div>

      <Input
        label="Address"
        name="address_line"
        value={formData.address_line}
        onChange={handleChange}
        error={errors.address_line}
        placeholder="123 Main Street, Apt 4B"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
          placeholder="Karachi"
          required
        />
        <Input
          label="Postal Code"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleChange}
          error={errors.postal_code}
          placeholder="75500"
          required
        />
        <Input
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          error={errors.country}
          placeholder="Pakistan"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Saving...' : submitText}
      </Button>
    </form>
  );
}
