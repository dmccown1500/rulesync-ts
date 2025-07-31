# Django Framework Best Practices

## Project Organization

- **Django apps**: Break functionality into focused Django apps
- **Settings organization**: Use separate settings files for different environments
- **URL organization**: Keep URL patterns organized and namespaced
- **Template organization**: Structure templates logically
- **Static and media files**: Properly configure static and media file handling

```python
# Project structure
project/
├── apps/
│   ├── users/           # User management app
│   ├── products/        # Product management app
│   ├── orders/          # Order management app
│   └── common/          # Shared utilities
├── config/
│   ├── settings/        # Environment-specific settings
│   │   ├── __init__.py
│   │   ├── base.py      # Base settings
│   │   ├── development.py
│   │   ├── production.py
│   │   └── testing.py
│   ├── urls.py         # Main URL configuration
│   └── wsgi.py         # WSGI configuration
├── templates/          # Project templates
├── static/             # Static files
├── media/              # User-uploaded files
└── requirements/       # Environment-specific requirements

# Settings organization (config/settings/base.py)
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# App organization
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
    'django_extensions',
]

LOCAL_APPS = [
    'apps.users',
    'apps.products',
    'apps.orders',
    'apps.common',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS
```

## Models and Database

- **Model design**: Follow Django model best practices
- **Database constraints**: Use database-level constraints
- **Model validation**: Implement proper model validation
- **QuerySet optimization**: Use select_related and prefetch_related
- **Custom managers**: Create custom managers for complex queries

```python
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone

class TimestampedModel(models.Model):
    """Base model with created_at and updated_at fields."""
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class ActiveManager(models.Manager):
    """Manager to get only active objects."""
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)

class Product(TimestampedModel):
    """Product model with proper validation and constraints."""
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(unique=True, db_index=True)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    category = models.ForeignKey(
        'Category', 
        on_delete=models.PROTECT,
        related_name='products'
    )
    is_active = models.BooleanField(default=True, db_index=True)
    
    # Custom managers
    objects = models.Manager()  # Default manager
    active = ActiveManager()    # Custom manager

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['price', 'is_active']),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(price__gte=0),
                name='price_non_negative'
            ),
        ]

    def __str__(self):
        return self.name

    def clean(self):
        """Custom validation logic."""
        super().clean()
        if self.price and self.price < 0:
            raise ValidationError({'price': 'Price cannot be negative'})
        
        # Check for duplicate names in the same category
        if Product.objects.filter(
            name=self.name, 
            category=self.category
        ).exclude(pk=self.pk).exists():
            raise ValidationError({
                'name': 'Product with this name already exists in this category'
            })

    def save(self, *args, **kwargs):
        """Override save to run clean validation."""
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def is_on_sale(self):
        """Check if product is currently on sale."""
        return hasattr(self, 'sale') and self.sale.is_active

class ProductQuerySet(models.QuerySet):
    """Custom QuerySet for Product model."""
    
    def active(self):
        return self.filter(is_active=True)
    
    def by_category(self, category):
        return self.filter(category=category)
    
    def price_range(self, min_price, max_price):
        return self.filter(price__range=(min_price, max_price))
    
    def with_category(self):
        return self.select_related('category')
    
    def with_reviews(self):
        return self.prefetch_related('reviews')

# Add custom QuerySet to manager
Product.objects = ProductQuerySet.as_manager()
```

## Views and URL Patterns

- **Class-based views**: Use CBVs for common patterns
- **Mixins**: Create reusable view mixins
- **URL namespacing**: Use namespaces to organize URLs
- **Permission handling**: Implement proper permission checks
- **Response formatting**: Use consistent response formats

```python
# views.py
from django.views.generic import ListView, DetailView, CreateView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404

class AjaxResponseMixin:
    """Mixin to add AJAX support to any view."""
    
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax():
            return super().dispatch(request, *args, **kwargs)
        return self.ajax_dispatch(request, *args, **kwargs)
    
    def ajax_dispatch(self, request, *args, **kwargs):
        """Handle AJAX requests."""
        try:
            response = super().dispatch(request, *args, **kwargs)
            if hasattr(response, 'render'):
                response.render()
            return JsonResponse({
                'success': True,
                'html': response.content.decode('utf-8')
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)

class ProductListView(LoginRequiredMixin, ListView):
    """List view for products with filtering and pagination."""
    model = Product
    template_name = 'products/list.html'
    context_object_name = 'products'
    paginate_by = 20

    def get_queryset(self):
        queryset = Product.active.with_category()
        
        # Apply filters
        category = self.request.GET.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        min_price = self.request.GET.get('min_price')
        max_price = self.request.GET.get('max_price')
        if min_price and max_price:
            queryset = queryset.price_range(min_price, max_price)
        
        # Apply search
        search = self.request.GET.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) |
                models.Q(description__icontains=search)
            )
        
        return queryset.order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        context['current_filters'] = {
            'category': self.request.GET.get('category', ''),
            'min_price': self.request.GET.get('min_price', ''),
            'max_price': self.request.GET.get('max_price', ''),
            'search': self.request.GET.get('search', ''),
        }
        return context

class ProductDetailView(DetailView):
    """Detail view for a single product."""
    model = Product
    template_name = 'products/detail.html'
    context_object_name = 'product'

    def get_queryset(self):
        return Product.active.with_category().with_reviews()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['related_products'] = Product.active.filter(
            category=self.object.category
        ).exclude(pk=self.object.pk)[:4]
        return context

# urls.py
from django.urls import path, include

app_name = 'products'

urlpatterns = [
    path('', ProductListView.as_view(), name='list'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='detail'),
    path('create/', ProductCreateView.as_view(), name='create'),
    path('<slug:slug>/edit/', ProductUpdateView.as_view(), name='edit'),
    path('<slug:slug>/delete/', ProductDeleteView.as_view(), name='delete'),
]

# Main urls.py
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.api.urls')),
    path('products/', include('apps.products.urls')),
    path('users/', include('apps.users.urls')),
    path('', HomeView.as_view(), name='home'),
]
```

## Forms and Validation

- **Model forms**: Use ModelForm for model-based forms
- **Form validation**: Implement proper form validation
- **Custom widgets**: Create custom form widgets when needed
- **Form sets**: Use formsets for handling multiple forms
- **CSRF protection**: Ensure CSRF protection is enabled

```python
from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import UserCreationForm
from .models import Product, Category

class ProductForm(forms.ModelForm):
    """Form for creating and updating products."""
    
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'category', 'is_active']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
            'price': forms.NumberInput(attrs={'step': '0.01', 'min': '0'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Customize field attributes
        self.fields['name'].widget.attrs.update({'class': 'form-control'})
        self.fields['category'].queryset = Category.objects.filter(is_active=True)
        
        # Make fields required
        self.fields['name'].required = True
        self.fields['price'].required = True

    def clean_name(self):
        """Validate product name."""
        name = self.cleaned_data.get('name')
        if name:
            name = name.strip().title()
            if len(name) < 3:
                raise ValidationError('Product name must be at least 3 characters long')
        return name

    def clean_price(self):
        """Validate product price."""
        price = self.cleaned_data.get('price')
        if price is not None and price <= 0:
            raise ValidationError('Price must be greater than zero')
        return price

    def clean(self):
        """Cross-field validation."""
        cleaned_data = super().clean()
        name = cleaned_data.get('name')
        category = cleaned_data.get('category')

        if name and category:
            # Check for duplicate names in the same category
            existing = Product.objects.filter(name=name, category=category)
            if self.instance.pk:
                existing = existing.exclude(pk=self.instance.pk)
            
            if existing.exists():
                raise ValidationError(
                    'A product with this name already exists in this category'
                )

        return cleaned_data

class ProductSearchForm(forms.Form):
    """Form for searching products."""
    search = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'placeholder': 'Search products...',
            'class': 'form-control'
        })
    )
    category = forms.ModelChoiceField(
        queryset=Category.objects.filter(is_active=True),
        required=False,
        empty_label='All Categories',
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    min_price = forms.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'Min price',
            'step': '0.01'
        })
    )
    max_price = forms.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'Max price',
            'step': '0.01'
        })
    )

    def clean(self):
        cleaned_data = super().clean()
        min_price = cleaned_data.get('min_price')
        max_price = cleaned_data.get('max_price')

        if min_price and max_price and min_price > max_price:
            raise ValidationError('Minimum price cannot be greater than maximum price')

        return cleaned_data
```

## Django REST Framework

- **Serializers**: Use appropriate serializer types
- **ViewSets**: Use ViewSets for standard CRUD operations
- **Permissions**: Implement granular permissions
- **Filtering and pagination**: Configure filtering and pagination
- **API versioning**: Implement API versioning

```python
from rest_framework import serializers, viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 
            'category', 'category_name', 'is_active', 
            'is_on_sale', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def validate_price(self, value):
        """Validate price field."""
        if value <= 0:
            raise serializers.ValidationError('Price must be greater than zero')
        return value

    def validate(self, attrs):
        """Cross-field validation."""
        name = attrs.get('name')
        category = attrs.get('category')

        if name and category:
            existing = Product.objects.filter(name=name, category=category)
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)
            
            if existing.exists():
                raise serializers.ValidationError(
                    'A product with this name already exists in this category'
                )

        return attrs

class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for Product CRUD operations."""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active', 'price']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Optimize queryset with select_related."""
        return Product.objects.select_related('category').filter(is_active=True)

    def perform_create(self, serializer):
        """Set additional fields on create."""
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """Toggle product active status."""
        product = self.get_object()
        product.is_active = not product.is_active
        product.save()
        return Response({
            'status': 'active' if product.is_active else 'inactive',
            'message': f'Product is now {"active" if product.is_active else "inactive"}'
        })

    @action(detail=False)
    def featured(self, request):
        """Get featured products."""
        featured_products = self.get_queryset().filter(is_featured=True)[:10]
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)
```

## Testing

- **Test organization**: Organize tests logically
- **Test data**: Use fixtures or factory_boy for test data
- **Test coverage**: Maintain good test coverage
- **Integration tests**: Test complete workflows
- **API testing**: Test API endpoints thoroughly

```python
from django.test import TestCase, TransactionTestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
import factory

User = get_user_model()

class CategoryFactory(factory.django.DjangoModelFactory):
    """Factory for creating Category instances."""
    class Meta:
        model = Category

    name = factory.Sequence(lambda n: f'Category {n}')
    slug = factory.LazyAttribute(lambda obj: obj.name.lower().replace(' ', '-'))

class ProductFactory(factory.django.DjangoModelFactory):
    """Factory for creating Product instances."""
    class Meta:
        model = Product

    name = factory.Faker('commerce_product_name')
    description = factory.Faker('text')
    price = factory.Faker('pydecimal', left_digits=3, right_digits=2, positive=True)
    category = factory.SubFactory(CategoryFactory)

class ProductModelTest(TestCase):
    """Test Product model."""

    def setUp(self):
        self.category = CategoryFactory()

    def test_product_creation(self):
        """Test product creation with valid data."""
        product = ProductFactory(category=self.category)
        self.assertTrue(isinstance(product, Product))
        self.assertEqual(product.category, self.category)
        self.assertIsNotNone(product.slug)

    def test_product_str_representation(self):
        """Test product string representation."""
        product = ProductFactory(name='Test Product')
        self.assertEqual(str(product), 'Test Product')

    def test_duplicate_name_validation(self):
        """Test that duplicate names in same category are not allowed."""
        ProductFactory(name='Test Product', category=self.category)
        
        with self.assertRaises(ValidationError):
            duplicate_product = Product(
                name='Test Product',
                category=self.category,
                price=10.00
            )
            duplicate_product.full_clean()

class ProductViewTest(TestCase):
    """Test Product views."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.category = CategoryFactory()
        self.products = ProductFactory.create_batch(5, category=self.category)

    def test_product_list_view(self):
        """Test product list view."""
        url = reverse('products:list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.products[0].name)

    def test_product_detail_view(self):
        """Test product detail view."""
        product = self.products[0]
        url = reverse('products:detail', kwargs={'slug': product.slug})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, product.name)
        self.assertContains(response, product.description)

class ProductAPITest(APITestCase):
    """Test Product API endpoints."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.category = CategoryFactory()
        self.products = ProductFactory.create_batch(3, category=self.category)

    def test_get_product_list(self):
        """Test GET /api/products/"""
        url = reverse('product-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 3)

    def test_create_product_authenticated(self):
        """Test POST /api/products/ with authentication."""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'name': 'New Product',
            'description': 'Product description',
            'price': '29.99',
            'category': self.category.id
        }
        
        url = reverse('product-list')
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 4)

    def test_create_product_unauthenticated(self):
        """Test POST /api/products/ without authentication."""
        data = {
            'name': 'New Product',
            'description': 'Product description',
            'price': '29.99',
            'category': self.category.id
        }
        
        url = reverse('product-list')
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
```

## Performance and Optimization

- **Database optimization**: Use select_related and prefetch_related
- **Caching**: Implement caching strategies
- **Query optimization**: Optimize database queries
- **Static file optimization**: Use CDN for static files
- **Database connection pooling**: Configure connection pooling

```python
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

# Query optimization
class ProductListView(ListView):
    def get_queryset(self):
        return Product.objects.select_related('category').prefetch_related(
            'reviews__user'
        ).filter(is_active=True)

# Caching
@method_decorator(cache_page(60 * 15), name='dispatch')  # Cache for 15 minutes
class ProductListView(ListView):
    pass

# Custom caching
def get_featured_products():
    cache_key = 'featured_products'
    products = cache.get(cache_key)
    
    if products is None:
        products = Product.objects.filter(
            is_featured=True, 
            is_active=True
        ).select_related('category')[:10]
        cache.set(cache_key, products, 60 * 30)  # Cache for 30 minutes
    
    return products

# Database connection settings
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
        'CONN_MAX_AGE': 60,  # Connection pooling
        'OPTIONS': {
            'MAX_CONNS': 20,
            'MIN_CONNS': 5,
        }
    }
}
```