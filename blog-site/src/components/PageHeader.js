import React from 'react'

function PageHeader(props) {
  return (
    <div className='row'>
          <div className='col-lg-12'>
              <div className='card' style={{marginTop: "1%"}}>
                  <div className='card-body' >
                      <h3 style={{textAlign: 'left', fontSize: "1.5rem"}}>Viewing: {props.page_title}</h3>
                  </div>
              </div>
           </div>
        </div>
  )
}

export default PageHeader