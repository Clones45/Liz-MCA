/**
 * Main entry point. Initializes all modules.
 */

import { initNavigation } from './navigation.js';
import { initForm } from './form.js';
import { initFAQ } from './faq.js';
import { initAnimations } from './animations.js';

// Import only the icons we actually use
import { createIcons,
  ShieldCheck, Users, TrendingUp, CreditCard, Landmark, Rocket,
  Wrench, Banknote, Building2, Store, Building, Sprout, Utensils,
  HardHat, Briefcase, Phone, Mail, MapPin, ArrowRight,
  CheckCircle, Coins, Shield, Package, Megaphone, Hammer,
  Clock, Calendar, XCircle, Zap,
  MessageCircle, BarChart3
} from 'lucide';

document.addEventListener('DOMContentLoaded', () => {
  // Replace icon placeholders with SVGs
  createIcons({
    icons: {
      ShieldCheck, Users, TrendingUp, CreditCard, Landmark, Rocket,
      Wrench, Banknote, Building2, Store, Building, Sprout, Utensils,
      HardHat, Briefcase, Phone, Mail, MapPin, ArrowRight,
      CheckCircle, Coins, Shield, Package, Megaphone, Hammer,
      Clock, Calendar, XCircle, Zap, MessageCircle, BarChart3
    }
  });

  // Initialize modules
  initNavigation();
  initForm();
  initFAQ();
  initAnimations();
});
