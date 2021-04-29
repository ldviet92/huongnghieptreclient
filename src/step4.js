import React, { useState, useEffect } from 'react'
import { Button, Loader, Placeholder, Checkbox } from 'rsuite'
import { keyBy, groupBy, orderBy, filter, map, get } from 'lodash'

const { Paragraph } = Placeholder
export default function Step4 (props) {
  const { careers, perstypes, points, perstypeIdChoose } = props
  const perstypeObj = keyBy(perstypes, 'Id')
  const [jobsObj, setJobsObj] = useState({})

  useEffect(() => {
    if (perstypeIdChoose) {
      console.log(perstypeIdChoose)
      const newJobs = {}
      newJobs[perstypeIdChoose] = carrObj[perstypeIdChoose]
      console.log(newJobs)
      setJobsObj(newJobs)
    }
  }, [])
  if (!careers || !perstypes || !points) {
    return (
      <div>
        {' '}
        <Paragraph rows={8}>
          <Loader center content='loading' />
        </Paragraph>
      </div>
    )
  }

  const pointsSort = orderBy(points, 'Point', 'desc')
  const pointsProspecting = filter(pointsSort, item => item.Point >= 16)
  const pointsPromising = filter(pointsSort, item => item.Point > 5 && item.Point <= 15)
  const pointsChallenging = filter(pointsSort, item => item.Point <= 5)
  const carrObj = groupBy(careers, 'PerstypeId')

  const renderJobs = (jobsObj, perstypeObj) => {
    const jobs = Object.values(jobsObj)
    let newJobs = []

    for (let i = 0; i < jobs.length; i++) {
      newJobs = newJobs.concat(jobs[i])
    }

    return map(newJobs, job => {
      return (
        <tr key={job.Id}>
          <td>{job.Name}</td>
          <td>{get(perstypeObj, [job.PerstypeId, 'Name'])}</td>
        </tr>
      )
    })
  }

  const onChangeJob = (perstypeId, isChecked) => {
    let newJobs = {}
    if (isChecked) {
      newJobs[perstypeId] = carrObj[perstypeId]
    }

    if (!isChecked) {
      delete jobsObj[perstypeId]
    }
    newJobs = Object.assign(newJobs, jobsObj)
    setJobsObj(newJobs)
  }

  const perstypeJobs = (points, perstypesObj) => {
    return map(points, (p) => {
      let isCk = false
      if (jobsObj[p.PerstypeId]) {
        isCk = true
      }
      return (
        <Checkbox key={p.Id} value={p.PerstypeId} checked={isCk} onChange={(e, isChecked) => onChangeJob(e, isChecked)}>{perstypesObj[p.PerstypeId].Name}</Checkbox>
      )
    })
  }

  return (
    <div className='row mt-5'>
      <div className='col-md-3 p-3 border mb-5'>
        <div className='mt-3'>
          <h6>Triển vọng</h6>
          <hr />
          {perstypeJobs(pointsProspecting, perstypeObj)}
        </div>
        <div className='mt-5'>
          <h6>Hứa hẹn</h6>
          <hr />
          {perstypeJobs(pointsPromising, perstypeObj)}
        </div>
        <div className='mt-5'>
          <h6>Thử thách</h6>
          <hr />
          {perstypeJobs(pointsChallenging, perstypeObj)}
        </div>
      </div>
      <div className='col-md-9'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <td className='text-center font-weight-bold' scope='col'>
                Nghề
              </td>
              <td className='text-center font-weight-bold' scope='col'>
                Nhóm nghề
              </td>
            </tr>
          </thead>
          <tbody>{renderJobs(jobsObj, perstypeObj)}</tbody>
        </table>
      </div>
      <div className='col-12 text-center mt-5'>
        <Button onClick={props.onBackStep} appearance='primary'>
          Quay lại
        </Button>
      </div>
    </div>
  )
}
