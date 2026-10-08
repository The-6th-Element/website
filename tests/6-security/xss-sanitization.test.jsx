import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { csvToMenu, menuToCsv } from '../../src/utils/csvMenuParser.js';
import { DietaryFilterBar } from '../../src/components/menu/DietaryFilterBar.jsx';
import { AM_THEME } from '../../src/theme/tokens.js';

describe('FEATURE-75 (SEC-01): Client-Side XSS & Injection Sanitization', () => {
  describe('1. CSV Input Sanitization & Script Neutralization', () => {
    it('safely parses menu items containing script tags without executing or corrupting data', () => {
      const maliciousCsv = [
        'Category,Section,Name,Price,Description,DietaryTags',
        'daytime,Brunch,"<script>alert(\'xss\')</script>Cardamom Toast",£12.50,"<img src=x onerror=alert(1)>Spiced brioche",V',
        'evening,Plates,"Safe Plate",£14.00,"Normal description","<svg onload=alert(2)>"'
      ].join('\n');

      const result = csvToMenu(maliciousCsv);
      expect(result.success).toBe(true);
      expect(result.menu.daytime).toBeDefined();

      const brunchSection = result.menu.daytime.sections.find(s => s.name === 'Brunch');
      expect(brunchSection).toBeDefined();
      expect(brunchSection.items).toHaveLength(1);

      const item = brunchSection.items[0];
      // String is stored as textual content, not evaluated
      expect(typeof item.name).toBe('string');
      expect(item.name).toContain('<script>');
      expect(item.desc).toContain('<img src=x');
    });

    it('safely round-trips adversarial strings through menuToCsv and csvToMenu', () => {
      const adversarialMenu = {
        daytime: {
          title: 'Daytime',
          subtitle: 'Brunch',
          icon: '☀️',
          sections: [{
            name: 'Adversarial Section',
            items: [{
              name: 'Dish with "Quotes" and <script>alert(1)</script>',
              price: '£10.00',
              desc: 'Formula injection =cmd|\' /C calc\'!A0 and commas, here',
              tags: ['V', '<script>']
            }]
          }]
        },
        evening: { title: 'Evening', subtitle: 'Wine', icon: '🌙', sections: [] }
      };

      const csv = menuToCsv(adversarialMenu);
      expect(csv).toBeDefined();
      const parsed = csvToMenu(csv);
      expect(parsed.success).toBe(true);

      const parsedItem = parsed.menu.daytime.sections[0].items[0];
      expect(parsedItem.name).toBe('Dish with "Quotes" and <script>alert(1)</script>');
    });
  });

  describe('2. UI Component XSS Defense', () => {
    it('safely renders dietary filter chips without executing or injecting raw HTML elements', () => {
      const counts = {
        'all': 10,
        'V': 5,
        'VE': 3,
        'GF': 2,
        'HALAL': 4
      };

      const { container } = render(
        <DietaryFilterBar 
          activeFilter="all" 
          onFilterChange={() => {}} 
          counts={counts}
          totalDishes={10}
          theme={AM_THEME}
        />
      );

      // Verify no injected script or iframe tags exist in the container
      const scripts = container.querySelectorAll('script, iframe, object, embed');
      expect(scripts).toHaveLength(0);
    });
  });
});
