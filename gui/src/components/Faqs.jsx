import Image from 'next/image'

import backgroundImage from '@/images/background-faqs.jpg'
import roadmap from '@/images/roadmap.png'
import economy from '@/images/economy.png'

const faqs = [
  [
    {
      question: 'What do I do with the ANNA token?',
      answer:
        'ANNA tokens can be staked in the staking pool to earn 2 type of rewards.',
    },
    {
      question: 'What are the rewards for staking ANNA tokens?',
      answer:
        'Staking ANNA tokens allows the protocol to share its profits with the holders. Furthermore, staking ANNA tokens rewards holders with gANNA tokens that allows some individual to buy over this entire protocol for a certain amount of gANNA.',
    },
    {
      question: 'How does the protocol make money?',
      answer: `There are various revenue streams:
        DEX exchange fees
        Service revenue generated from ANNA offerings such as educational couses, crypto index funds, binary options etc.
        Marketplace revenue generated from creation and trading of digital assets
        Protocol revenue generated form ongoing operations
        Partnership revenue generated from investors and sponsors`,
    },
  ],
  [
    {
      question: 'What is gAnna?',
      answer:
        'gANNA is an ERC20 tokens with a fixed supply of 29.99k. gANNA cannot be initially bought but only earned via staking ANNA tokens via the staking pool. The ownership of the entire ANNA protocol will be transferred to the first user with 10k gANNA to claim ownership.',
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
