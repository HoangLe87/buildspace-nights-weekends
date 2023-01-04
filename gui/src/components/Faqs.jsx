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
        'Staking ANNA tokens allows the protocol to share its profits with the holders. Furthermore, staking ANNA tokens rewards holders with LOVE tokens that allows some individual to claim ownership of the entire ecosystem once he has obtained 10k LOVE tokens.',
    },
    {
      question: 'How does the protocol make money?',
      answer:
        'There are various revenue streams e.g. DEX exchange, marketplace, partnerships and revenue generated from ANNA offerings such as educational couses, crypto index funds, binary options etc.',
    },
  ],
  [
    {
      question: 'What are LOVE tokens?',
      answer:
        'They are ERC20 tokens with a fixed supply of 29.99k. LOVE tokens measure your progress and cannot be initially bought but only earned via staking ANNA tokens via the staking pool. The ownership of the entire ANNA ecosystem shall be claimed by the first user with 10k LOVE tokens.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="py-20sm:py-32 relative my-10 overflow-hidden bg-slate-50"
    >
      <Image
        className="max-w-screen absolute top-0 left-1/2 translate-x-[-50%] -translate-y-1/4"
        src={backgroundImage}
        alt=""
        width={1558}
        height={1000}
        unoptimized
      />
      <div className="relative px-2">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            <span className="bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text  text-transparent">
              Frequently asked questions
            </span>
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
        className="mt-10 w-screen"
        src={roadmap}
        alt=""
        height={1636}
        unoptimized
      />
    </section>
  )
}
