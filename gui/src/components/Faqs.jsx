import Image from 'next/image'

import backgroundImage from '@/images/background-faqs.jpg'
import roadmap from '@/images/roadmap.png'

const faqs = [
  [
    {
      question: 'What do I do with the ANNA token?',
      answer:
        'ANNA tokens can be staked in the staking pool to earn 2 types of rewards.',
    },
    {
      question: 'What are the rewards for staking ANNA tokens?',
      answer:
        'Staking ANNA tokens allows the protocol to share its profits with the holders. Furthermore, staking ANNA tokens rewards holders with gANNA tokens that allows some individual to claim ownership over this entire ecosystem once he has obtained 10k gANNA tokens.',
    },
    {
      question: 'How does the protocol make money?',
      answer:
        'There are various revenue streams e.g. DEX exchange, marketplace, partnerships and revenue generated from ANNA offerings such as educational couses, crypto index funds, binary options etc.',
    },
  ],
  [
    {
      question: 'What is gAnna?',
      answer:
        'gANNA tokens are ERC20 tokens with a fixed supply of 29.99k. gANNA tokens cannot be initially bought but only earned via staking ANNA tokens via the staking pool. The ownership of the entire ANNA ecosystem shall be claimed by the first user with 10k gANNA tokens.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <div className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            If you can’t find what you’re looking for, join our discord or drop
            us an email.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <Image
        className="mt-10"
        src={roadmap}
        alt=""
        width={2245}
        height={1636}
        unoptimized
      />
    </section>
  )
}
