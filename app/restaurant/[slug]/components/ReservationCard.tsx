'use client'

import { useState } from 'react'
import { partySize as partySizes, times } from '../../../../data'
import DatePicker from 'react-datepicker'
import useAvailabilities from '../../../../hooks/useAvailabilities'
import { CircularProgress } from '@mui/material'
import Link from 'next/link'
import { convertToDisplayTime } from '../../../../utils/converToDisplayTime'

export default function ReservationCard({ openTime, closeTime, slug }: { openTime: string, closeTime: string, slug: string }) {
  const { data, loading, error, fetchAvailabilities } = useAvailabilities()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [time, setTime] = useState(openTime)
  const [partySize, setPartySize] = useState('2')
  const [day, setDay] = useState(new Date().toISOString().split('T')[0])

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split('T')[0])
      return setSelectedDate(date)
    }
    return setSelectedDate(null)
  }

  const handleClick = () => {
    fetchAvailabilities({
      slug,
      day,
      time,
      partySize
    })
  }

  const filterTimesByRestaurantTimeWindow = () => {
    const timesInWindow: typeof times = []

    let isInWindow = false

    times.forEach(time => {
      if (time.time === openTime) {
        isInWindow = true
      }
      if (isInWindow) {
        timesInWindow.push(time)
      }
      if (time.time === closeTime) {
        isInWindow = false
      }
    })

    return timesInWindow
  }

  return (
    <div className="w-72 bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select name="" className="py-3 border-b font-light bg-white" id="" value={partySize} onChange={(e) => setPartySize(e.target.value)}>
          {partySizes.map(size => (
            <option value={size.value} key={size.value}>{size.label}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker selected={selectedDate} onChange={handleChangeDate} className='py-3 border-b font-light text-reg w-28 bg-white' dateFormat='MMM d' wrapperClassName='w-[48%]' />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select name="" id="" value={time} onChange={(e) => setTime(e.target.value)} className="py-3 border-b font-light bg-white">
            {filterTimesByRestaurantTimeWindow().map(time => (
              <option value={time.time} key={time.time}>{time.displayTime}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? <CircularProgress color='inherit' /> : 'Find a time'}
        </button>
      </div>

      {data && data.length ? (
        <div className='mt-4'>
          <p className='text-reg'>Select a Time</p>
          <div className='flex flex-wrap mt-2'>
            {data.map(time => (
              time.available ? (
                <Link key={time.time} href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${partySize}`} className='bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3'>
                  <p className='text-sm font-bold'>{convertToDisplayTime(time.time)}</p>
                </Link>
              ) : (
                <div key={time.time} className='bg-gray-300 cursor-not-allowed p-2 w-24 text-center text-white mb-3 rounded mr-3'>
                  <p className='text-sm font-bold'>{convertToDisplayTime(time.time)}</p>
                </div>
              )
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}