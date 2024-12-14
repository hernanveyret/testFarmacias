import React from 'react';
import './maps.css';
//-33.32922605314793, -60.21959430386491
const Maps = ({name}) => {
  let  direcciones = [
    {
      name:"Alonso",
      html: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3333.337832949518!2d-60.22275492433331!3d-33.33612279166634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7673e317fe47b%3A0x8744f041cc81236a!2sFarmacia%20Alonso!5e0!3m2!1ses-419!2sar!4v1725507113786!5m2!1ses-419!2sar" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
      name:"Ciminari",
      html:`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3333.31154249203!2d-60.235836024333324!3d-33.33680979170132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b767963c6c7b79%3A0xcc7ad5561ca25429!2sAv.%20Alberdi%20699%2C%20B2900%20San%20Nicol%C3%A1s%20de%20Los%20Arroyos%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1725510195529!5m2!1ses-419!2sar" width="90" height="45" style="border:0;"  loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
      name:"Garcia",
      lat: -33.32922605314793,
      lon: -60.21959430386491,
      html:`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3333.596106498951!2d-60.2196681103643!3d-33.32937313942823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7678c548914c5%3A0xf6c3c4f38c2d7762!2sBelgrano%20184%2C%20B2900%20San%20Nicol%C3%A1s%20de%20Los%20Arroyos%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1725507820827!5m2!1ses-419!2sar" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
      name:"Gomez",
      html:`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3332.662460214595!2d-60.2444588243325!3d-33.35376709256733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b76709c4121f3f%3A0xb531615bd428c471!2sAv.%20Pres.%20Juan%20Domingo%20Per%C3%B3n%201366%2C%20B2900%20San%20Nicol%C3%A1s%20de%20Los%20Arroyos%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1725508819743!5m2!1ses-419!2sar" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
      name:"Leone",
      html:``
    },
    {
      name:"Pza. Sarmiento",
      html:``
    },
    {
      name:"Tonello",
      html:``
    }
  ]
console.log(direcciones)
const select = direcciones.find(f => f.name = 'Garcia');
console.log(select)
  return (
    <div className="containerMaps">
      <p>{select.name}</p>
    {
      <div className="maps" key={1} dangerouslySetInnerHTML={{ __html: direcciones[2].html }} />
    }
    </div>
  )
}
export default Maps;