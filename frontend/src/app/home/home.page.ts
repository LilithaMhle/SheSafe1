import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  ingredients: string;
  safety_score: number;
  safety_label: string;
  description: string;
  price_range: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  currentUser: any = null;
  showModal = false;
  showSafetyGuide = false;

  searchQuery = '';
  selectedCategory = '';
  sortBy = 'safety';
  isLoading = true;

  readonly categories = ['All', 'Sanitary Pad', 'Tampon', 'Panty Liner'];

  private readonly API = 'http://localhost:3000';

  // ── Fallback data (shown if backend is offline) ───────────────
  readonly fallbackProducts: Product[] = [
    { id: 1, name: 'Stayfree Ultra Thin', brand: 'Stayfree', category: 'Sanitary Pad',
      ingredients: 'Nonwoven polypropylene cover, Super absorbent polymer (SAP) core, Polyethylene back sheet, Adhesive strips',
      safety_score: 48, safety_label: 'Higher Risk',
      description: 'Stayfree was among the brands directly named in the 2026 UFS study on EDCs in SA sanitary products. The NCC has initiated a formal investigation. EDCs including bisphenols and parabens were detected. Manufacturers state chemical levels fall within international regulatory limits, but long-term cumulative exposure remains a concern.',
      price_range: 'R20–R45' },
    { id: 2, name: 'Always Infinity FlexFoam', brand: 'Always', category: 'Sanitary Pad',
      ingredients: 'FlexFoam absorbent core, Nonwoven cover, Polyethylene back sheet, Fragrance, Adhesive strips',
      safety_score: 45, safety_label: 'Higher Risk',
      description: 'Always was among the brands directly named and tested in the 2026 UFS study. Contains added fragrance which can cause irritation. Bisphenols were detected in 100% of sanitary pads tested. Limited public ingredient transparency.',
      price_range: 'R40–R75' },
    { id: 3, name: 'Kotex Natural', brand: 'Kotex', category: 'Sanitary Pad',
      ingredients: 'Organic cotton top layer, Chlorine-free cellulose pulp, Polyethylene back sheet, Hydrogenated mineral oil, No fragrance',
      safety_score: 60, safety_label: 'Moderate Risk',
      description: 'Kotex was directly named in the 2026 UFS study. The Natural range uses organic cotton and no fragrance — better than conventional options. However, bisphenols were detected across all pads tested regardless of organic marketing claims.',
      price_range: 'R55–R95' },
    { id: 4, name: 'Natracare Organic', brand: 'Natracare', category: 'Sanitary Pad',
      ingredients: '100% GOTS certified organic cotton, Ecologically certified cellulose pulp, Plant starch back sheet, BPA-free glue, No fragrance, No dyes, No chlorine bleach, No plastic',
      safety_score: 96, safety_label: 'Very Low Risk',
      description: 'Natracare is the gold standard in safe menstrual products. GOTS certified and independently tested. Free from phthalates, bisphenols, parabens, plastic, synthetic fragrances and dyes. Gynaecologist recommended.',
      price_range: 'R85–R140' },
    { id: 5, name: 'Lil-Lets Ultra', brand: 'Lil-Lets', category: 'Sanitary Pad',
      ingredients: 'Nonwoven cover, Cellulose pulp core, Polyethylene back sheet, Fragrance, Adhesive strips',
      safety_score: 50, safety_label: 'Moderate Risk',
      description: 'Lil-Lets was directly named in the 2026 UFS study. Contains added fragrance. Bisphenols detected in 100% of pads and parabens in over 81% of pads tested.',
      price_range: 'R25–R50' },
    { id: 6, name: 'Carefree Panty Liner', brand: 'Carefree', category: 'Panty Liner',
      ingredients: 'Polyester nonwoven cover, Cellulose pulp core, Polyethylene back sheet, Synthetic fragrance, Adhesive',
      safety_score: 38, safety_label: 'Higher Risk',
      description: 'Contains synthetic fragrance. The 2026 UFS study found phthalates in 100% of panty liners tested. Panty liners have prolonged daily contact with sensitive skin, making chemical exposure a greater cumulative concern.',
      price_range: 'R25–R45' },
    { id: 7, name: 'Twinsaver Regular', brand: 'Twinsaver', category: 'Sanitary Pad',
      ingredients: 'Cellulose fluff pulp core, Nonwoven polypropylene cover, Polyethylene back sheet, SAP, No added fragrance',
      safety_score: 65, safety_label: 'Low-Moderate Risk',
      description: 'South African brand not among the nine directly named in the 2026 UFS NCC investigation. Contains no added fragrance. A practical mid-range option for students on a tight budget.',
      price_range: 'R12–R28' },
    { id: 8, name: 'Clicks Organics', brand: 'Clicks', category: 'Sanitary Pad',
      ingredients: 'Organic cotton cover, Chlorine-free cellulose pulp, No fragrance, No dyes, Biodegradable back sheet',
      safety_score: 88, safety_label: 'Low Risk',
      description: 'Clicks private-label organic range. Uses organic cotton and chlorine-free processing with no added fragrance or dyes. Not among the brands under NCC investigation.',
      price_range: 'R65–R105' },
    { id: 9, name: 'Caress Regular Maxi', brand: 'Caress', category: 'Sanitary Pad',
      ingredients: 'Cellulose pulp core, Nonwoven polyester top sheet, Polyethylene back sheet, SAP, Adhesive strip',
      safety_score: 52, safety_label: 'Moderate Risk',
      description: 'Shoprite private-label brand, locally manufactured. Not among the nine brands directly named in the NCC investigation. At R5 per pack it is the most financially accessible option for low-income students.',
      price_range: 'R5–R15' },
    { id: 10, name: 'Lil-Lets SmartFit Tampon', brand: 'Lil-Lets', category: 'Tampon',
      ingredients: 'Viscose (no chlorine bleach), Polyester/Polyethylene cover, Cotton/Polyester string, Compostable wrapper',
      safety_score: 72, safety_label: 'Low-Moderate Risk',
      description: 'Uses viscose bleached without chlorine. No added fragrance. Widely available at Clicks, Dis-Chem, Woolworths and Pick n Pay.',
      price_range: 'R40–R70' },
    { id: 11, name: 'Lil-Lets Organic Cotton Tampon', brand: 'Lil-Lets', category: 'Tampon',
      ingredients: '100% GOTS certified organic cotton, No fragrance, No dyes, No chlorine bleach, Compostable wrapper',
      safety_score: 94, safety_label: 'Very Low Risk',
      description: 'GOTS certified and ICEA approved. Made from 100% pure organic cotton, GM-free. Dermatologically tested. One of the safest tampon options in SA.',
      price_range: 'R65–R110' },
    { id: 12, name: 'Tampax Pearl Regular', brand: 'Tampax', category: 'Tampon',
      ingredients: 'Purified cotton and rayon blend, BPA-free plastic applicator, No fragrance',
      safety_score: 68, safety_label: 'Low-Moderate Risk',
      description: 'Made without elemental chlorine bleaching, no added fragrance. OEKO-TEX Standard 100 certified — tested for over 1000 harmful substances.',
      price_range: 'R55–R90' },
    { id: 13, name: 'Kotex Regular Tampon', brand: 'Kotex', category: 'Tampon',
      ingredients: 'Elemental chlorine-free bleached rayon, Polyester/Polyethylene cover, No fragrance, BPA-free',
      safety_score: 70, safety_label: 'Low-Moderate Risk',
      description: 'Elemental chlorine-free rayon bleaching process. Fragrance-free and BPA-free. OEKO-TEX Standard 100 certified.',
      price_range: 'R45–R80' },
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.checkSession();
    this.loadProducts();
  }

  // ── FIX 1: Session check — redirect to login if not logged in ──
  checkSession() {
    this.http.get<any>(`${this.API}/api/me`, { withCredentials: true }).subscribe({
      next: (res) => {
        if (res.logged_in) {
          this.currentUser = res;
        } else {
          this.router.navigate(['/login'], { replaceUrl: true });
        }
      },
      error: () => {
        // If backend is offline, allow fallback data to show
        // but don't redirect — user can still see products
      }
    });
  }

  // ── FIX 2: Added withCredentials: true ────────────────────────
  loadProducts() {
    this.isLoading = true;
    this.http.get<Product[]>(`${this.API}/api/products`, { withCredentials: true }).subscribe({
      next: (data) => {
        this.allProducts = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        // Backend offline — use fallback data so app still works
        this.allProducts = this.fallbackProducts;
        this.applyFilters();
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    let result = [...this.allProducts];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (this.selectedCategory && this.selectedCategory !== 'All') {
      result = result.filter(p => p.category === this.selectedCategory);
    }

    if (this.sortBy === 'safety') {
      result.sort((a, b) => b.safety_score - a.safety_score);
    } else if (this.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'risk') {
      result.sort((a, b) => a.safety_score - b.safety_score);
    }

    this.filteredProducts = result;
  }

  onSearchChange(event: any) {
    this.searchQuery = event.detail.value || '';
    this.applyFilters();
  }

  onCategoryChange(cat: string) {
    this.selectedCategory = cat === 'All' ? '' : cat;
    this.applyFilters();
  }

  onSortChange(event: any) {
    this.sortBy = event.detail.value;
    this.applyFilters();
  }

  openProduct(product: Product) {
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
  }

  // ── FIX 3: Logout ──────────────────────────────────────────────
  onLogout() {
    this.http.post(`${this.API}/api/logout`, {}, { withCredentials: true }).subscribe({
      next:  () => this.router.navigate(['/login'], { replaceUrl: true }),
      error: () => this.router.navigate(['/login'], { replaceUrl: true }),
    });
  }

  getSafetyColor(score: number): string {
    if (score >= 85) return '#22c55e';
    if (score >= 65) return '#84cc16';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  }

  getSafetyBadgeClass(label: string): string {
    if (label.includes('Very Low')) return 'badge-very-low';
    if (label === 'Low Risk')       return 'badge-low';
    if (label.includes('Low-Mod'))  return 'badge-low-mod';
    if (label.includes('Moderate')) return 'badge-moderate';
    return 'badge-high';
  }

  getIngredientList(ingredients: string): string[] {
    return ingredients.split(',').map(i => i.trim()).filter(i => i.length > 0);
  }

  isActiveCat(cat: string): boolean {
    if (cat === 'All') return !this.selectedCategory;
    return this.selectedCategory === cat;
  }
}
