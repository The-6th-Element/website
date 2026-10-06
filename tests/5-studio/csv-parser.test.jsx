import { describe, it, expect } from 'vitest'
import { menuToCsv, csvToMenu } from '../../src/utils/csvMenuParser'

describe('BK-14: Menu Studio CSV Import/Export Suite', () => {
  const sampleMenu = {
    daytime: {
      title: 'Daytime',
      subtitle: 'Brunch & Specialty Coffee',
      icon: '☀️',
      sections: [
        {
          name: 'Signature Brunch',
          items: [
            {
              name: 'Cardamom French Toast',
              price: '£12.50',
              desc: 'Brioche, saffron mascarpone, spiced jaggery caramel',
              tags: ['V'],
            },
            {
              name: 'Avocado Tartine',
              price: '£10.50',
              desc: 'Sourdough, whipped feta, pomegranate seeds',
              tags: ['V', 'VE'],
            },
          ],
        },
      ],
    },
    evening: {
      title: 'Evening',
      subtitle: 'Natural Wine & Small Plates',
      icon: '🌙',
      sections: [
        {
          name: 'Plates',
          items: [
            {
              name: 'Old Delhi Butter Chicken',
              price: '£16.00',
              desc: 'Smoked tandoori chicken, fenugreek, makhani sauce',
              tags: ['GF', 'HALAL'],
            },
          ],
        },
      ],
    },
  }

  it('exports structured menu into valid RFC 4180 CSV string', () => {
    const csv = menuToCsv(sampleMenu)
    expect(csv).toContain('Category,Section,Name,Price,Description,DietaryTags')
    expect(csv).toContain('daytime,Signature Brunch,Cardamom French Toast,£12.50')
    expect(csv).toContain('evening,Plates,Old Delhi Butter Chicken,£16.00')
  })

  it('parses CSV text back into structured daytime & evening categories', () => {
    const csv = [
      'Category,Section,Name,Price,Description,DietaryTags',
      'daytime,Brunch,Eggs Florentine,£11.00,Poached eggs and spinach,V',
      'evening,Mains,Kerala Prawn Curry,£17.50,Coconut and curry leaves,GF; HALAL',
    ].join('\r\n')

    const res = csvToMenu(csv)
    expect(res.success).toBe(true)
    expect(res.menu.daytime.sections.length).toBeGreaterThan(0)
    expect(res.menu.evening.sections.length).toBeGreaterThan(0)

    const brunchSec = res.menu.daytime.sections.find(s => s.name === 'Brunch')
    expect(brunchSec).toBeDefined()
    expect(brunchSec.items[0].name).toBe('Eggs Florentine')
    expect(brunchSec.items[0].tags).toContain('V')

    const mainsSec = res.menu.evening.sections.find(s => s.name === 'Mains')
    expect(mainsSec).toBeDefined()
    expect(mainsSec.items[0].name).toBe('Kerala Prawn Curry')
    expect(mainsSec.items[0].tags).toContain('GF')
    expect(mainsSec.items[0].tags).toContain('HALAL')
  })

  it('fails gracefully when CSV is empty or missing headers', () => {
    const emptyRes = csvToMenu('')
    expect(emptyRes.success).toBe(false)
    expect(emptyRes.error).toMatch(/empty/i)

    const invalidHeaderRes = csvToMenu('Foo,Bar,Baz\n1,2,3')
    expect(invalidHeaderRes.success).toBe(false)
    expect(invalidHeaderRes.error).toMatch(/Name/i)
  })
})
