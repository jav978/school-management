export interface InstitutionSettings {
  dea_code?: string
  system_subtitle?: string
  statistical_code?: string
  educational_zone?: string
  dependency?: string
  [key: string]: any
}

export interface InstitutionData {
  id: number
  name: string
  legal_name?: string
  tax_id: string
  rif: string
  logo_url: string | null
  website?: string | null
  email: string
  phone_primary: string
  phone_secondary?: string | null
  address_line1: string
  accreditation_no?: string
  dea_code: string
  system_subtitle: string
  statistical_code: string
  educational_zone: string
  dependency: string
  official_seal_url?: string | null
  signatures?: any[]
  settings?: InstitutionSettings
}

export const useInstitution = () => {
  const api = useApi()

  const institution = useState<InstitutionData>('institution_data', () => ({
    id: 1,
    name: 'U.E Colegio "Santa Luisa"',
    legal_name: 'U.E Colegio Santa Luisa',
    tax_id: 'J-315628015',
    rif: 'J-315628015',
    logo_url: null,
    official_seal_url: null,
    signatures: [
      { role: 'Directora', name: 'Sor María Dolores Amaya', title: 'Directora General', id_card: 'V-6.241.890', signature_url: null },
      { role: 'Control de Estudios', name: 'Prof. Elena Vargas', title: 'Control de Estudios', id_card: 'V-11.458.789', signature_url: null },
      { role: 'Docente Guía', name: 'Prof. Carlos Mendoza', title: 'Docente Guía', id_card: 'V-14.890.123', signature_url: null }
    ],
    website: null,
    email: 'contacto@santaluisa.edu.ve',
    phone_primary: '+58 212 123 4567',
    address_line1: 'Calle Real del Prado de María, Caracas',
    accreditation_no: 'S0098D0101',
    dea_code: 'S0098D0101',
    system_subtitle: 'Gestión Escolar',
    statistical_code: '10845',
    educational_zone: 'DISTRITO CAPITAL',
    dependency: 'Privada Subvencionada por MPPE',
    settings: {
      dea_code: 'S0098D0101',
      system_subtitle: 'Gestión Escolar',
      statistical_code: '10845',
      educational_zone: 'DISTRITO CAPITAL',
      dependency: 'Privada Subvencionada por MPPE',
      official_seal_url: null,
      signatures: [
        { role: 'Directora', name: 'Sor María Dolores Amaya', title: 'Directora General', id_card: 'V-6.241.890', signature_url: null },
        { role: 'Control de Estudios', name: 'Prof. Elena Vargas', title: 'Control de Estudios', id_card: 'V-11.458.789', signature_url: null },
        { role: 'Docente Guía', name: 'Prof. Carlos Mendoza', title: 'Docente Guía', id_card: 'V-14.890.123', signature_url: null }
      ]
    }
  }))

  const loading = useState<boolean>('institution_loading', () => false)
  const isLoaded = useState<boolean>('institution_is_loaded', () => false)

  const fetchInstitution = async (force = false) => {
    if (isLoaded.value && !force) return institution.value
    loading.value = true
    try {
      const res = await api.get('institutions/1')
      if (res && res.id) {
        institution.value = {
          ...institution.value,
          ...res,
          rif: res.rif || res.tax_id || institution.value.rif,
          dea_code: res.dea_code || res.accreditation_no || institution.value.dea_code,
          system_subtitle: res.system_subtitle || institution.value.system_subtitle
        }
        isLoaded.value = true
      }
    } catch (err) {
      console.warn('Silent fallback loading institution data:', err)
    } finally {
      loading.value = false
    }
    return institution.value
  }

  const updateInstitution = async (payload: Partial<InstitutionData>) => {
    loading.value = true
    try {
      const updated = await api.patch('institutions/1', payload)
      if (updated && updated.id) {
        institution.value = {
          ...institution.value,
          ...updated,
          rif: updated.rif || updated.tax_id || payload.rif || institution.value.rif,
          dea_code: updated.dea_code || updated.accreditation_no || payload.dea_code || institution.value.dea_code,
          system_subtitle: updated.system_subtitle || payload.system_subtitle || institution.value.system_subtitle
        }
      }
      return institution.value
    } finally {
      loading.value = false
    }
  }

  return {
    institution,
    loading,
    fetchInstitution,
    updateInstitution
  }
}
