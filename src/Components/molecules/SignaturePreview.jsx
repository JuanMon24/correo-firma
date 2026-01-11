import { useRef, useEffect, useState } from 'react'
import { formatPhoneNumber } from '../../utils/js/formatPhoneNumber'

const SignaturePreview = ({ userData, setInfoRef }) => {
  const [formattedPositions, setFormattedPositions] = useState('')
  const infoRef = useRef(null)

  useEffect(() => {
    setInfoRef(infoRef)
  }, [setInfoRef])  

  useEffect(() => {
    const formatPositions = (positions) => {
      return positions.map((position, index) => (
        <span key={index}>
          {position}
          {index < positions.length - 1 && <em style={{ fontWeight: '300' }}>&</em>}
        </span>
      ))
    }

    if (Array.isArray(userData.position)) {
      setFormattedPositions(formatPositions(userData.position))
    } else {
      setFormattedPositions(userData.position)
    }
  }, [userData.position])

  const displayName = userData.signature_name.trim() !== '' ? userData.signature_name : userData.name
  const formattedPhone = formatPhoneNumber(userData.phone)


  return (
    <table ref={infoRef} align='center' border='0' cellPadding='0' cellSpacing='0' style={{ width: '100%' }}>
      <tbody>
        <tr>
          <td style={{ direction: 'ltr', textAlign: 'center' }}>
            <div style={{ fontSize: '0px', textAlign: 'left', direction: 'ltr', display: 'inline-block', verticalAlign: 'top', width: '100%' }}>
              <table border='0' cellPadding='0' cellSpacing='0' style={{ verticalAlign: 'top' }} width='100%'>
                <tbody>
                  <tr>
                    <td align='left' style={{ fontSize: '0px' , wordBreak: 'break-word' }}>
                      <div style={{ fontFamily: 'Verdana, sans-serif', fontSize: '16px', lineHeight: '20px', fontWeight: '700', textAlign: 'left', color: '#3B0A89'}}>{displayName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td align='left' style={{ fontSize: '0px', padding: '0 0 3px', wordBreak: 'break-word' }}>
                      <div style={{ fontFamily: 'Verdana, sans-serif', fontSize: '12px', lineHeight: '12px', fontWeight: '500', textAlign: 'left', color: '#3B0A89' }}>{formattedPositions}</div>
                    </td>
                  </tr>
                  <tr>
                    <td align='left' style={{ fontSize: '0px', padding: '0 0 5px', wordBreak: 'break-word' }}>
                      <table border='0' cellPadding='0' cellSpacing='0' style={{ borderCollapse: 'collapse', borderSpacing: '0px' }}>
                        <tbody>
                          <tr>
                            <td>
                              <img alt='banner' src={userData.bannerSrc} style={{ border: '0', display: 'block', outline: 'none', textDecoration: 'none', height: 'auto', width: '250px', fontSize: '13px' }} />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align='left' style={{ fontSize: '0px', padding: '0 0 3px', wordBreak: 'break-word' }}>
                      <a href={`mailto:${userData.email}`} style={{ display: 'inline-block', background: 'transparent', color: '#3B0A89', fontFamily: 'Verdana, sans-serif', fontSize: '11px', lineHeight: '11px', fontWeight: 'normal', margin: '0', textDecoration: 'none', textTransform: 'none', padding: '0 0 2px', borderRadius: '3px' }} target='_blank' rel='noopener noreferrer'>{userData.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td align='left' style={{ fontSize: '0px', padding: '0', wordBreak: 'break-word' }}>
                      <table border='0' cellPadding='0' cellSpacing='0' style={{ borderCollapse: 'separate', lineHeight: '100%' }}>
                        <tbody>
                          <tr>
                            <td align='center' style={{ border: 'none', borderRadius: '3px', cursor: 'auto', background: 'transparent' }} valign='middle'>
                              <a href={`tel:${userData.phone}`} style={{ display: 'inline-block', background: 'transparent', color: '#3B0A89', fontFamily: 'Verdana, sans-serif', fontSize: '11px', lineHeight: '11px', fontWeight: 'normal',  margin: '0', textDecoration: 'none', textTransform: 'none', padding: '0', borderRadius: '3px' }} target='_blank' rel='noopener noreferrer'>{formattedPhone}</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default SignaturePreview