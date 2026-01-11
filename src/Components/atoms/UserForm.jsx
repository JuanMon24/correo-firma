import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from './Button'
import { getFormOptions } from '../../utils/js/formConfig'

const schema = yup.object().shape({
  name: yup.string().required('El nombre es obligatorio').min(3, 'Debe tener al menos 3 caracteres'),
  signature_name: yup.string(),
  email: yup.string().required('El email es obligatorio').matches(/^[a-zA-Z0-9._%+-]+@owak\.co$/, 'Debe ser un correo válido de Owak'),
  phone: yup.string().required('El teléfono es obligatorio').matches(/^[0-9]{10}$/, 'Debe tener 10 dígitos'),
  country: yup.string().required('Selecciona el código de tu país'),
  area: yup.string().required('Debe seleccionar un área'),
  position: yup.array().min(1, 'Debe seleccionar al menos un cargo'),
  hat: yup.string().required('Debe seleccionar un hat'),
})

const UserForm = ({ config }) => {
  const { mode, user, onSubmit, onEdit, onClose } = config
  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isValid, dirtyFields } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: mode === 'edit' ? {} : {
      name: '',
      signature_name: '',
      email: '',
      phone: '',
      country: '',
      area: '',
      position: [],
      hat: '',
    }
  })

  const [areas, setAreas] = useState([])
  const [positions, setPositions] = useState([])
  const [hats, setHats] = useState([])
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)

  const nameValue = watch('name')
  const selectedArea = watch('area')
  const selectedHat = watch('hat')
  const selectedPosition = watch('position')
  const [signatureNameModified, setSignatureNameModified] = useState(false)

  useEffect(() => {
    if (mode === 'add') {
      const options = getFormOptions('');
      setAreas(options.areas);
      setCountries(options.countries);
      setHats(options.hats);
      setPositions([]);
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'edit' && user && Object.keys(user).length > 0) {
      const options = getFormOptions(user.area || '');
      setAreas(options.areas);
      setCountries(options.countries);
      setHats(options.hats);
      setPositions(getFormOptions(user.area).positions || []);
  
      if (user.phone) {
        const phoneMatch = user.phone.match(/^(\+\d{1,3})(\d{10})$/);
        if (phoneMatch) {
          setValue('country', phoneMatch[1]);
          setValue('phone', phoneMatch[2]);
        }
      }
  
      setValue('name', user.name || '');
      setValue('signature_name', user.signature_name || '');
      setValue('email', user.email || '');
      setValue('area', user.area || '');
      setValue('position', user.position || []);
      setValue('hat', user.hat || '');
  
      setLoading(false);
    }
  }, [mode, user, setValue]);

  useEffect(() => {
    if (selectedArea) {
      const newPositions = getFormOptions(selectedArea).positions || []
      setPositions(newPositions)

      if (mode === 'edit' && user?.area !== selectedArea) {
        setValue('position', [])
      }
    }
  }, [selectedArea, user?.area, mode, setValue])

  useEffect(() => {
    if (mode === 'add' && !signatureNameModified) {
      setValue('signature_name', nameValue)
    }
  }, [nameValue, signatureNameModified, setValue, mode])

  const handleSignatureNameChange = () => {
    setSignatureNameModified(true)
  }

  const onFormSubmit = async (data) => {
    if (mode === 'edit' && !user?.id) {
      console.error("Error: Intentando editar un usuario sin ID.");
      return;
    }
  
    const phoneWithCountryCode = `${data.country}${data.phone}`;
    const formData = {
      ...data,
      phone: phoneWithCountryCode,
      position: Array.isArray(data.position) ? data.position : [data.position],
    };
  
    // Solo agrega ID si estamos en modo edición
    if (mode === 'edit' && user?.id) {
      formData.id = user.id;
    }
  
    delete formData.country;
  
    console.log("Enviando datos al servidor:", formData);
  
    if (mode === 'add') {
      onSubmit(formData);
    } else if (mode === 'edit') {
      await onEdit(formData);
      onClose();
    }
    reset();
  };

  const showSubmitButton = mode === 'add' ? isValid : Object.keys(dirtyFields).length > 0
  const iconClass = mode === 'add' ? 'fa-paper-plane' : 'fa-floppy-disk'

  if (loading && mode === 'edit') return <p>Cargando datos...</p>

  return (
    <form className='d-grid cont-form g-15' onSubmit={handleSubmit(onFormSubmit)}>
      <div className='d-grid label-input g-5'>
        <label className='paragraph txt-right txt-purple' htmlFor='name'>Nombre:</label>
        <input className='br-15 border-gray txt-darkgray txt-capitalize legal' type='text' id='name' placeholder='Ej: Julian David' {...register('name')} />
      </div>
      <div className='d-grid label-input g-5'>
        <label className='paragraph txt-right txt-purple' htmlFor='signature_name'>Nombre Firma:</label>
        <input className='br-15 border-gray txt-darkgray txt-capitalize legal' type='text' id='signature_name' placeholder='Ej: Julian' {...register('signature_name')} onChange={handleSignatureNameChange} />
      </div>
      <div className='d-grid label-input g-5'>
        <label className='paragraph txt-right txt-purple' htmlFor='email'>Email:</label>
        <input className='br-15 border-gray txt-darkgray legal' type='email' id='email' placeholder='Ej: julian@owak.co' {...register('email')} />
      </div>
      <div className='d-grid label-input g-5'>
        <label className='paragraph txt-right txt-purple' htmlFor='phone'>Teléfono:</label>
        <div className='d-flex g-5'>
          <select className='txt-darkgray border-gray br-15 legal p-15' id='country' {...register('country')}>
            <option value=''>Cód. País</option>
            {countries.map((country, index) => (
              <option key={index} value={country.code}>{country.name} {country.code}</option>
            ))}
          </select>
          <input className='br-15 border-gray txt-darkgray legal' type='tel' id='phone' placeholder='Ej: 1234567890' maxLength='10' {...register('phone')} />
        </div>
      </div>
      <div className='group-select g-15'>
        <div className='d-grid label-input g-5'>
          <label className='paragraph txt-right txt-purple' htmlFor='area'>Área:</label>
          <select className='txt-darkgray border-gray br-15 legal p-15' id='area' {...register('area')}>
            <option value=''>Seleccione un área</option>
            {areas.map((area, index) => <option key={index} value={area}>{area}</option>)}
          </select>
        </div>
        <div className='d-grid label-input g-5'>
          <label className='paragraph txt-right txt-purple' htmlFor='position'>Cargo:</label>
          <select className='txt-darkgray border-gray br-15 legal p-15' id='position' multiple {...register('position')}>
            {positions.map((position, index) => (
              <option key={index} value={position}>{position}</option>
            ))}
          </select>
        </div>
        <div className='d-grid label-input g-5'>
          <label className='paragraph txt-right txt-purple' htmlFor='hat'>Hat:</label>
          <select className='txt-darkgray border-gray br-15 legal p-15' id='hat' {...register('hat')}>
            {hats.map((hat, index) => (
              <option key={index} value={hat}>{hat}</option>
            ))}
          </select>
        </div>
      </div>

      {showSubmitButton && (
        <Button className='bg-orange d-flex txt-white btn--submit legal br-15 g-5'>
          <i className={`fa-regular ${iconClass}`} /> {mode === 'add' ? 'Agregar usuario' : 'Guardar cambios'}
        </Button>
      )}
    </form>
  )
}

export default UserForm