import React, { useEffect, useState } from 'react'

const VISIBILITY_OFFSET = 600

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.pageYOffset > VISIBILITY_OFFSET) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <div
      className={`${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } fixed bottom-2 right-2 cursor-pointer transition-all hidden md:block`}
    >
      <div
        className="text-white bg-brand-blue rounded-lg font-sf-compact-medium font-bold py-2 px-5"
        onClick={scrollToTop}
      >
        Back to Top
      </div>
    </div>
  )
}
