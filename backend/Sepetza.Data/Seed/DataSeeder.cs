using Microsoft.EntityFrameworkCore;
using Sepetza.Core.Entities;
using Sepetza.Data.Context;
using BCrypt.Net;

namespace Sepetza.Data.Seed;

public static class DataSeeder
{
    public static async Task SeedAsync(SepetzaDbContext context)
    {
        // Admin Kullanıcısı
        if (!await context.Users.AnyAsync(u => u.Role == Core.Entities.UserRole.Admin))
        {
            await SeedAdminUser(context);
        }

        // Kategoriler
        if (!await context.Categories.AnyAsync())
        {
            await SeedCategories(context);
        }

        // Ürünler
        if (!await context.Products.AnyAsync())
        {
            await SeedProducts(context);
        }

        // Ürün Görselleri
        if (!await context.ProductImages.AnyAsync())
        {
            await SeedProductImages(context);
        }
    }

    private static async Task SeedAdminUser(SepetzaDbContext context)
    {
        // Admin kullanıcısı oluştur
        var adminUser = new User
        {
            FirstName = "Admin",
            LastName = "User",
            Email = "admin@sepetza.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"), // Güçlü şifre
            PhoneNumber = "+90 555 123 45 67",
            Role = UserRole.Admin,
            CreatedDate = DateTime.UtcNow
        };

        await context.Users.AddAsync(adminUser);
        await context.SaveChangesAsync();
        
        Console.WriteLine("✅ Admin user seeded successfully");
        Console.WriteLine("📧 Email: admin@sepetza.com");
        Console.WriteLine("🔐 Password: Admin123!");
    }

    private static async Task SeedProducts(SepetzaDbContext context)
    {
        var products = new List<Product>();

        // Alt kategorileri al
        var telefonTabletCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Telefon & Tablet");
        var bilgisayarCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Bilgisayar");
        var sesGoruntuCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Ses & Görüntü");
        var gamingCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Gaming");
        var kameraCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kamera");

        var kadinGiyimCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kadın Giyim");
        var erkekGiyimCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Erkek Giyim");
        var ayakkabiCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Ayakkabı");
        var cantaAksesuarCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Çanta & Aksesuar");
        var outdoorGiyimCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Outdoor Giyim");

        var mobilyaCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Mobilya");
        var mutfakCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Mutfak");
        var banyoCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Banyo");
        var tekstilCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Tekstil");
        var dekorasyonCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Dekorasyon");

        var fitnessCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Fitness");
        var kosuCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Koşu");
        var outdoorCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Outdoor");
        var suSporlariCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Su Sporları");
        var kisSporlariCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kış Sporları");

        // Yeni kategoriler
        var kitaplarCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kitaplar");
        var muzikCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Müzik");
        var filmCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Film & Dizi");
        
        var cocukOyuncakCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Çocuk Oyuncakları");
        var puzzleCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Puzzle & Zeka Oyunları");
        var hobiCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Hobi Malzemeleri");
        
        var makyajCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Makyaj");
        var ciltBakimCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Cilt Bakımı");
        var parfumCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Parfüm");
        
        var yedekParcaCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Yedek Parça");
        var otomotivAksesuarCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Aksesuar");
        var bakimUrunleriCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Bakım Ürünleri");
        
        var bahceMalzemeCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Bahçe Malzemeleri");
        var elAletleriCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "El Aletleri");
        var yapiMalzemeCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Yapı Malzemeleri");

        // Elektronik Alt Kategoriler
        if (telefonTabletCategory != null)
            products.AddRange(GetTelefonTabletProducts(telefonTabletCategory.Id));
        
        if (bilgisayarCategory != null)
            products.AddRange(GetBilgisayarProducts(bilgisayarCategory.Id));
        
        if (sesGoruntuCategory != null)
            products.AddRange(GetSesGoruntuProducts(sesGoruntuCategory.Id));
        
        if (gamingCategory != null)
            products.AddRange(GetGamingProducts(gamingCategory.Id));
        
        if (kameraCategory != null)
            products.AddRange(GetKameraProducts(kameraCategory.Id));

        // Giyim Alt Kategoriler
        if (kadinGiyimCategory != null)
            products.AddRange(GetKadinGiyimProducts(kadinGiyimCategory.Id));
        
        if (erkekGiyimCategory != null)
            products.AddRange(GetErkekGiyimProducts(erkekGiyimCategory.Id));
        
        if (ayakkabiCategory != null)
            products.AddRange(GetAyakkabiProducts(ayakkabiCategory.Id));
        
        if (cantaAksesuarCategory != null)
            products.AddRange(GetCantaAksesuarProducts(cantaAksesuarCategory.Id));
        
        if (outdoorGiyimCategory != null)
            products.AddRange(GetOutdoorGiyimProducts(outdoorGiyimCategory.Id));

        // Ev & Yaşam Alt Kategoriler
        if (mobilyaCategory != null)
            products.AddRange(GetMobilyaProducts(mobilyaCategory.Id));
        
        if (mutfakCategory != null)
            products.AddRange(GetMutfakProducts(mutfakCategory.Id));
        
        if (banyoCategory != null)
            products.AddRange(GetBanyoProducts(banyoCategory.Id));
        
        if (tekstilCategory != null)
            products.AddRange(GetTekstilProducts(tekstilCategory.Id));
        
        if (dekorasyonCategory != null)
            products.AddRange(GetDekorasyonProducts(dekorasyonCategory.Id));

        // Spor & Outdoor Alt Kategoriler
        if (fitnessCategory != null)
            products.AddRange(GetFitnessProducts(fitnessCategory.Id));
        
        if (kosuCategory != null)
            products.AddRange(GetKosuProducts(kosuCategory.Id));
        
        if (outdoorCategory != null)
            products.AddRange(GetOutdoorProducts(outdoorCategory.Id));
        
        if (suSporlariCategory != null)
            products.AddRange(GetSuSporlariProducts(suSporlariCategory.Id));
        
        if (kisSporlariCategory != null)
            products.AddRange(GetKisSporlariProducts(kisSporlariCategory.Id));

        // Kitap & Medya Alt Kategoriler
        if (kitaplarCategory != null)
            products.AddRange(GetKitaplarProducts(kitaplarCategory.Id));
        
        if (muzikCategory != null)
            products.AddRange(GetMuzikProducts(muzikCategory.Id));
        
        if (filmCategory != null)
            products.AddRange(GetFilmProducts(filmCategory.Id));

        // Oyuncak & Hobi Alt Kategoriler
        if (cocukOyuncakCategory != null)
            products.AddRange(GetCocukOyuncakProducts(cocukOyuncakCategory.Id));
        
        if (puzzleCategory != null)
            products.AddRange(GetPuzzleProducts(puzzleCategory.Id));
        
        if (hobiCategory != null)
            products.AddRange(GetHobiProducts(hobiCategory.Id));

        // Kozmetik & Bakım Alt Kategoriler
        if (makyajCategory != null)
            products.AddRange(GetMakyajProducts(makyajCategory.Id));
        
        if (ciltBakimCategory != null)
            products.AddRange(GetCiltBakimProducts(ciltBakimCategory.Id));
        
        if (parfumCategory != null)
            products.AddRange(GetParfumProducts(parfumCategory.Id));

        // Otomotiv Alt Kategoriler
        if (yedekParcaCategory != null)
            products.AddRange(GetYedekParcaProducts(yedekParcaCategory.Id));
        
        if (otomotivAksesuarCategory != null)
            products.AddRange(GetOtomotivAksesuarProducts(otomotivAksesuarCategory.Id));
        
        if (bakimUrunleriCategory != null)
            products.AddRange(GetBakimUrunleriProducts(bakimUrunleriCategory.Id));

        // Bahçe & Yapı Market Alt Kategoriler
        if (bahceMalzemeCategory != null)
            products.AddRange(GetBahceMalzemeProducts(bahceMalzemeCategory.Id));
        
        if (elAletleriCategory != null)
            products.AddRange(GetElAletleriProducts(elAletleriCategory.Id));
        
        if (yapiMalzemeCategory != null)
            products.AddRange(GetYapiMalzemeProducts(yapiMalzemeCategory.Id));

        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();
        Console.WriteLine($"✅ {products.Count} products seeded successfully");
    }

    private static async Task SeedCategories(SepetzaDbContext context)
    {
        // Ana kategoriler
        var mainCategories = new List<Category>
        {
            new Category
            {
                Name = "Elektronik",
                Description = "Telefon, bilgisayar, tablet ve elektronik aksesuarlar",
                ImageUrl = "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
                DisplayOrder = 1,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            },
            new Category
            {
                Name = "Giyim",
                Description = "Kadın, erkek ve çocuk giyim ürünleri",
                ImageUrl = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
                DisplayOrder = 2,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            },
            new Category
            {
                Name = "Ev & Yaşam",
                Description = "Ev dekorasyonu, mutfak ve yaşam ürünleri",
                ImageUrl = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
                DisplayOrder = 3,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            },
            new Category
            {
                Name = "Spor & Outdoor",
                Description = "Spor giyim, fitness ve outdoor ürünleri",
                ImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                DisplayOrder = 4,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            },
            new Category
            {
                Name = "Kitap & Medya",
                Description = "Kitap, dergi, müzik ve film ürünleri",
                ImageUrl = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
                DisplayOrder = 5,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            },
            new Category
            {
                Name = "Oyuncak & Hobi",
                Description = "Çocuk oyuncakları ve hobi ürünleri",
                ImageUrl = "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400",
                DisplayOrder = 6,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            },
            new Category
            {
                Name = "Kozmetik & Bakım",
                Description = "Kozmetik, parfüm ve kişisel bakım ürünleri",
                ImageUrl = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
                DisplayOrder = 7,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            },
            new Category
            {
                Name = "Otomotiv",
                Description = "Araç yedek parça ve aksesuarları",
                ImageUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
                DisplayOrder = 8,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            },
            new Category
            {
                Name = "Bahçe & Yapı Market",
                Description = "Bahçe malzemeleri ve yapı market ürünleri",
                ImageUrl = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
                DisplayOrder = 9,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            }
        };

        await context.Categories.AddRangeAsync(mainCategories);
        await context.SaveChangesAsync();

        // Alt kategoriler
        var elektronikCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Elektronik");
        var giyimCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Giyim");
        var evYasamCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Ev & Yaşam");
        var sporCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Spor & Outdoor");
        var kitapCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kitap & Medya");
        var oyuncakCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Oyuncak & Hobi");
        var kozmetikCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Kozmetik & Bakım");
        var otomotivCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Otomotiv");
        var bahceCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Bahçe & Yapı Market");

        var subCategories = new List<Category>();

        // Elektronik Alt Kategorileri
        if (elektronikCategory != null)
        {
            subCategories.AddRange(new List<Category>
            {
                new Category { Name = "Telefon & Tablet", Description = "Akıllı telefon ve tablet ürünleri", ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", ParentCategoryId = elektronikCategory.Id, DisplayOrder = 1, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Bilgisayar", Description = "Laptop, masaüstü ve aksesuarlar", ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400", ParentCategoryId = elektronikCategory.Id, DisplayOrder = 2, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Ses & Görüntü", Description = "Kulaklık, hoparlör ve TV", ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", ParentCategoryId = elektronikCategory.Id, DisplayOrder = 3, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Gaming", Description = "Oyun konsolu ve aksesuarlar", ImageUrl = "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400", ParentCategoryId = elektronikCategory.Id, DisplayOrder = 4, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Kamera", Description = "Fotoğraf makinesi ve aksesuarlar", ImageUrl = "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400", ParentCategoryId = elektronikCategory.Id, DisplayOrder = 5, IsActive = true, CreatedDate = DateTime.UtcNow }
            });
        }

        // Giyim Alt Kategorileri
        if (giyimCategory != null)
        {
            subCategories.AddRange(new List<Category>
            {
                new Category { Name = "Kadın Giyim", Description = "Kadın kıyafetleri", ImageUrl = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400", ParentCategoryId = giyimCategory.Id, DisplayOrder = 1, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Erkek Giyim", Description = "Erkek kıyafetleri", ImageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", ParentCategoryId = giyimCategory.Id, DisplayOrder = 2, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Ayakkabı", Description = "Kadın ve erkek ayakkabıları", ImageUrl = "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400", ParentCategoryId = giyimCategory.Id, DisplayOrder = 3, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Çanta & Aksesuar", Description = "Çanta, kemer ve aksesuarlar", ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", ParentCategoryId = giyimCategory.Id, DisplayOrder = 4, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Outdoor Giyim", Description = "Outdoor ve doğa sporları giyim", ImageUrl = "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400", ParentCategoryId = giyimCategory.Id, DisplayOrder = 5, IsActive = true, CreatedDate = DateTime.UtcNow }
            });
        }

        // Ev & Yaşam Alt Kategorileri
        if (evYasamCategory != null)
        {
            subCategories.AddRange(new List<Category>
            {
                new Category { Name = "Mobilya", Description = "Ev mobilyaları", ImageUrl = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", ParentCategoryId = evYasamCategory.Id, DisplayOrder = 1, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Mutfak", Description = "Mutfak gereçleri ve aletleri", ImageUrl = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400", ParentCategoryId = evYasamCategory.Id, DisplayOrder = 2, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Banyo", Description = "Banyo aksesuarları", ImageUrl = "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400", ParentCategoryId = evYasamCategory.Id, DisplayOrder = 3, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Tekstil", Description = "Ev tekstil ürünleri", ImageUrl = "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400", ParentCategoryId = evYasamCategory.Id, DisplayOrder = 4, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Dekorasyon", Description = "Ev dekorasyon ürünleri", ImageUrl = "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400", ParentCategoryId = evYasamCategory.Id, DisplayOrder = 5, IsActive = true, CreatedDate = DateTime.UtcNow }
            });
        }

        // Spor & Outdoor Alt Kategorileri
        if (sporCategory != null)
        {
            subCategories.AddRange(new List<Category>
            {
                new Category { Name = "Fitness", Description = "Fitness ve antrenman ekipmanları", ImageUrl = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400", ParentCategoryId = sporCategory.Id, DisplayOrder = 1, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Koşu", Description = "Koşu ayakkabısı ve aksesuarları", ImageUrl = "https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=400", ParentCategoryId = sporCategory.Id, DisplayOrder = 2, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Outdoor", Description = "Dağcılık ve kamp malzemeleri", ImageUrl = "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400", ParentCategoryId = sporCategory.Id, DisplayOrder = 3, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Su Sporları", Description = "Yüzme ve su sporları", ImageUrl = "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400", ParentCategoryId = sporCategory.Id, DisplayOrder = 4, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Kış Sporları", Description = "Kayak ve snowboard", ImageUrl = "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=400", ParentCategoryId = sporCategory.Id, DisplayOrder = 5, IsActive = true, CreatedDate = DateTime.UtcNow }
            });
        }

        // Kitap & Medya Alt Kategorileri
        if (kitapCategory != null)
        {
            subCategories.AddRange(new List<Category>
            {
                new Category { Name = "Kitaplar", Description = "Roman, bilim, tarih kitapları", ImageUrl = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400", ParentCategoryId = kitapCategory.Id, DisplayOrder = 1, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Müzik", Description = "CD, vinyl plaklar", ImageUrl = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", ParentCategoryId = kitapCategory.Id, DisplayOrder = 2, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Film & Dizi", Description = "DVD, Blu-ray diskler", ImageUrl = "https://images.unsplash.com/photo-1489599611389-7cfa0b7a0ac7?w=400", ParentCategoryId = kitapCategory.Id, DisplayOrder = 3, IsActive = true, CreatedDate = DateTime.UtcNow }
            });
        }

        // Oyuncak & Hobi Alt Kategorileri
        if (oyuncakCategory != null)
        {
            subCategories.AddRange(new List<Category>
            {
                new Category { Name = "Çocuk Oyuncakları", Description = "0-12 yaş oyuncakları", ImageUrl = "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400", ParentCategoryId = oyuncakCategory.Id, DisplayOrder = 1, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Puzzle & Zeka Oyunları", Description = "Eğitici oyunlar", ImageUrl = "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400", ParentCategoryId = oyuncakCategory.Id, DisplayOrder = 2, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Hobi Malzemeleri", Description = "El sanatları malzemeleri", ImageUrl = "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400", ParentCategoryId = oyuncakCategory.Id, DisplayOrder = 3, IsActive = true, CreatedDate = DateTime.UtcNow }
            });
        }

        // Kozmetik & Bakım Alt Kategorileri
        if (kozmetikCategory != null)
        {
            subCategories.AddRange(new List<Category>
            {
                new Category { Name = "Makyaj", Description = "Fondöten, ruj, maskara", ImageUrl = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400", ParentCategoryId = kozmetikCategory.Id, DisplayOrder = 1, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Cilt Bakımı", Description = "Temizlik, nemlendirici", ImageUrl = "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400", ParentCategoryId = kozmetikCategory.Id, DisplayOrder = 2, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Parfüm", Description = "Kadın ve erkek parfümleri", ImageUrl = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400", ParentCategoryId = kozmetikCategory.Id, DisplayOrder = 3, IsActive = true, CreatedDate = DateTime.UtcNow }
            });
        }

        // Otomotiv Alt Kategorileri
        if (otomotivCategory != null)
        {
            subCategories.AddRange(new List<Category>
            {
                new Category { Name = "Yedek Parça", Description = "Motor, fren parçaları", ImageUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400", ParentCategoryId = otomotivCategory.Id, DisplayOrder = 1, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Aksesuar", Description = "İç aksesuar, dış aksesuar", ImageUrl = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400", ParentCategoryId = otomotivCategory.Id, DisplayOrder = 2, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Bakım Ürünleri", Description = "Yağ, temizlik ürünleri", ImageUrl = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400", ParentCategoryId = otomotivCategory.Id, DisplayOrder = 3, IsActive = true, CreatedDate = DateTime.UtcNow }
            });
        }

        // Bahçe & Yapı Market Alt Kategorileri
        if (bahceCategory != null)
        {
            subCategories.AddRange(new List<Category>
            {
                new Category { Name = "Bahçe Malzemeleri", Description = "Tohum, gübre, saksı", ImageUrl = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400", ParentCategoryId = bahceCategory.Id, DisplayOrder = 1, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "El Aletleri", Description = "Çekiç, tornavida, anahtar", ImageUrl = "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400", ParentCategoryId = bahceCategory.Id, DisplayOrder = 2, IsActive = true, CreatedDate = DateTime.UtcNow },
                new Category { Name = "Yapı Malzemeleri", Description = "Çivi, vida, boya", ImageUrl = "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400", ParentCategoryId = bahceCategory.Id, DisplayOrder = 3, IsActive = true, CreatedDate = DateTime.UtcNow }
            });
        }

        await context.Categories.AddRangeAsync(subCategories);
        await context.SaveChangesAsync();
        Console.WriteLine($"✅ {mainCategories.Count} main categories and {subCategories.Count} subcategories seeded successfully");
    }

    // Elektronik Alt Kategori Ürünleri
    private static List<Product> GetTelefonTabletProducts(int categoryId)
    {
        return new List<Product>
        {
            new Product { Name = "iPhone 15 Pro", ShortDescription = "Apple'ın en gelişmiş telefonu", Description = "A17 Pro çip, ProRAW fotoğrafçılık", Price = 45999.99m, DiscountPrice = 42999.99m, SKU = "IP15PRO001", Brand = "Apple", StockQuantity = 50, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 324, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Samsung Galaxy S24", ShortDescription = "Samsung amiral gemisi", Description = "Güçlü performans ve mükemmel kamera", Price = 35999.99m, DiscountPrice = 32999.99m, SKU = "SGS24001", Brand = "Samsung", StockQuantity = 35, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.7, ReviewCount = 256, CreatedDate = DateTime.UtcNow },
            new Product { Name = "iPad Pro 12.9", ShortDescription = "Profesyonel tablet", Description = "M2 çip ile masaüstü performansı", Price = 32999.99m, DiscountPrice = 29999.99m, SKU = "IPADPRO001", Brand = "Apple", StockQuantity = 40, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 143, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Samsung Galaxy Tab S9", ShortDescription = "Android tablet", Description = "S Pen ile yaratıcılık", Price = 18999.99m, SKU = "SGTAB001", Brand = "Samsung", StockQuantity = 30, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 98, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Xiaomi Mi 13", ShortDescription = "Uygun fiyatlı akıllı telefon", Description = "Snapdragon 8 Gen 2", Price = 15999.99m, DiscountPrice = 13999.99m, SKU = "XIAOMI001", Brand = "Xiaomi", StockQuantity = 80, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.3, ReviewCount = 189, CreatedDate = DateTime.UtcNow }
        };
    }

    private static List<Product> GetBilgisayarProducts(int categoryId)
    {
        return new List<Product>
        {
            new Product { Name = "MacBook Air M3", ShortDescription = "Apple ultra hafif laptop", Description = "M3 çip ile güçlü performans", Price = 54999.99m, SKU = "MBA001", Brand = "Apple", StockQuantity = 25, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.9, ReviewCount = 189, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Dell XPS 13", ShortDescription = "Premium laptop", Description = "Intel Core i7, 16GB RAM", Price = 42999.99m, SKU = "DELL001", Brand = "Dell", StockQuantity = 20, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.3, ReviewCount = 87, CreatedDate = DateTime.UtcNow },
            new Product { Name = "HP Pavilion 15", ShortDescription = "Günlük kullanım laptop", Description = "AMD Ryzen 5, 8GB RAM", Price = 18999.99m, DiscountPrice = 16999.99m, SKU = "HP001", Brand = "HP", StockQuantity = 45, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.1, ReviewCount = 156, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Logitech MX Master 3", ShortDescription = "Kablosuz mouse", Description = "Ergonomik tasarım", Price = 2499.99m, SKU = "LOGITECH001", Brand = "Logitech", StockQuantity = 90, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Samsung 4K Monitor", ShortDescription = "27 inç 4K monitör", Description = "Profesyonel çalışma için", Price = 8999.99m, SKU = "SAMSUNG001", Brand = "Samsung", StockQuantity = 35, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 67, CreatedDate = DateTime.UtcNow }
        };
    }

    private static List<Product> GetSesGoruntuProducts(int categoryId)
    {
        return new List<Product>
        {
            new Product { Name = "Sony WH-1000XM5", ShortDescription = "Kablosuz kulaklık", Description = "Endüstri lideri gürültü engelleme", Price = 9999.99m, DiscountPrice = 8499.99m, SKU = "SONY001", Brand = "Sony", StockQuantity = 60, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.7, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
            new Product { Name = "AirPods Pro 2", ShortDescription = "Kablosuz kulakiçi", Description = "Aktif gürültü engelleme", Price = 7999.99m, DiscountPrice = 6999.99m, SKU = "AIRPODS001", Brand = "Apple", StockQuantity = 100, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.5, ReviewCount = 567, CreatedDate = DateTime.UtcNow },
            new Product { Name = "LG OLED 55", ShortDescription = "4K OLED TV", Description = "Mükemmel kontrast ve renk", Price = 34999.99m, DiscountPrice = 31999.99m, SKU = "LG001", Brand = "LG", StockQuantity = 12, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 89, CreatedDate = DateTime.UtcNow },
            new Product { Name = "JBL Charge 5", ShortDescription = "Taşınabilir Bluetooth hoparlör", Description = "20 saat pil ömrü", Price = 3999.99m, DiscountPrice = 3499.99m, SKU = "JBL001", Brand = "JBL", StockQuantity = 75, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.2, ReviewCount = 289, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Bose QuietComfort 45", ShortDescription = "Gürültü engelleyici kulaklık", Description = "Premium ses kalitesi", Price = 8999.99m, DiscountPrice = 7999.99m, SKU = "BOSE001", Brand = "Bose", StockQuantity = 45, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.6, ReviewCount = 178, CreatedDate = DateTime.UtcNow }
        };
    }

    private static List<Product> GetGamingProducts(int categoryId)
    {
        return new List<Product>
        {
            new Product { Name = "PlayStation 5", ShortDescription = "Yeni nesil oyun konsolu", Description = "4K gaming, SSD hızı", Price = 19999.99m, SKU = "PS5001", Brand = "Sony", StockQuantity = 25, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 567, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Xbox Series X", ShortDescription = "Microsoft oyun konsolu", Description = "4K 120fps gaming", Price = 18999.99m, SKU = "XBOX001", Brand = "Microsoft", StockQuantity = 30, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 345, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Nintendo Switch OLED", ShortDescription = "Taşınabilir oyun konsolu", Description = "7 inç OLED ekran", Price = 9999.99m, SKU = "NINTENDO001", Brand = "Nintendo", StockQuantity = 50, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.7, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Asus ROG Strix", ShortDescription = "Gaming laptop", Description = "RTX 4060, Intel i7", Price = 65999.99m, SKU = "ASUS001", Brand = "Asus", StockQuantity = 15, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 78, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Corsair K95 RGB", ShortDescription = "Mekanik gaming klavye", Description = "Cherry MX tuşlar", Price = 4999.99m, SKU = "CORSAIR001", Brand = "Corsair", StockQuantity = 45, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.5, ReviewCount = 167, CreatedDate = DateTime.UtcNow }
        };
    }

    private static List<Product> GetKameraProducts(int categoryId)
    {
        return new List<Product>
        {
            new Product { Name = "Canon EOS R6", ShortDescription = "Aynasız fotoğraf makinesi", Description = "20MP full frame sensor", Price = 89999.99m, SKU = "CANON001", Brand = "Canon", StockQuantity = 8, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.9, ReviewCount = 45, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Sony Alpha A7 IV", ShortDescription = "Full frame aynasız kamera", Description = "33MP BSI CMOS sensör", Price = 79999.99m, SKU = "SONY002", Brand = "Sony", StockQuantity = 12, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 67, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Nikon Z6 III", ShortDescription = "Hibrit fotoğraf/video kamera", Description = "24.5MP full frame", Price = 69999.99m, DiscountPrice = 64999.99m, SKU = "NIKON001", Brand = "Nikon", StockQuantity = 15, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.7, ReviewCount = 89, CreatedDate = DateTime.UtcNow },
            new Product { Name = "GoPro Hero 12", ShortDescription = "Aksiyon kamerası", Description = "5.3K video, su geçirmez", Price = 8999.99m, SKU = "GOPRO001", Brand = "GoPro", StockQuantity = 40, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.5, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
            new Product { Name = "DJI Pocket 2", ShortDescription = "Kompakt gimbal kamera", Description = "4K video, 3-axis gimbal", Price = 12999.99m, DiscountPrice = 11999.99m, SKU = "DJI001", Brand = "DJI", StockQuantity = 25, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 156, CreatedDate = DateTime.UtcNow }
        };
    }

    // Giyim Alt Kategori Ürünleri
    private static List<Product> GetKadinGiyimProducts(int categoryId)
    {
        return new List<Product>
        {
            new Product { Name = "Zara Blazer Ceket", ShortDescription = "Kadın blazer", Description = "Ofis şıklığı", Price = 899.99m, DiscountPrice = 699.99m, SKU = "ZARA001", Brand = "Zara", StockQuantity = 45, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.2, ReviewCount = 123, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Mango Elbise", ShortDescription = "Kadın günlük elbise", Description = "Rahat kesim", Price = 649.99m, SKU = "MANGO001", Brand = "Mango", StockQuantity = 60, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.5, ReviewCount = 156, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Bershka Crop Top", ShortDescription = "Kadın kısa tişört", Description = "Trend tasarım", Price = 299.99m, SKU = "BERSHKA001", Brand = "Bershka", StockQuantity = 100, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 3.9, ReviewCount = 345, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Stradivarius Etek", ShortDescription = "Mini etek", Description = "Denim kumaş", Price = 449.99m, SKU = "STRD001", Brand = "Stradivarius", StockQuantity = 85, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.2, ReviewCount = 156, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Koton Elbise", ShortDescription = "Yazlık elbise", Description = "Çiçek desenli", Price = 399.99m, SKU = "KOTON001", Brand = "Koton", StockQuantity = 95, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.1, ReviewCount = 234, CreatedDate = DateTime.UtcNow }
        };
    }

    private static List<Product> GetEvYasamProducts(int categoryId)
    {
        return new List<Product>
        {
            new Product { Name = "IKEA Kivik Koltuk", ShortDescription = "3'lü kanepe", Description = "Rahat oturma deneyimi", Price = 8999.99m, DiscountPrice = 7999.99m, SKU = "IKEA001", Brand = "IKEA", StockQuantity = 15, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.5, ReviewCount = 123, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Bellona Yatak Odası", ShortDescription = "Komplet yatak odası", Description = "Modern tasarım", Price = 15999.99m, SKU = "BELLONA001", Brand = "Bellona", StockQuantity = 8, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.3, ReviewCount = 67, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Tefal Tava Seti", ShortDescription = "Yapışmaz tava seti", Description = "3 parça tava", Price = 899.99m, DiscountPrice = 699.99m, SKU = "TEFAL001", Brand = "Tefal", StockQuantity = 85, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Karaca Yemek Takımı", ShortDescription = "Porselen yemek takımı", Description = "24 parça set", Price = 1299.99m, SKU = "KARACA001", Brand = "Karaca", StockQuantity = 45, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.2, ReviewCount = 156, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Philips Hava Fritözü", ShortDescription = "Yağsız pişirme", Description = "4.1L kapasité", Price = 2499.99m, DiscountPrice = 1999.99m, SKU = "PHILIPS001", Brand = "Philips", StockQuantity = 35, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.6, ReviewCount = 289, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Dyson V15 Süpürge", ShortDescription = "Kablosuz süpürge", Description = "Güçlü emme", Price = 12999.99m, SKU = "DYSON001", Brand = "Dyson", StockQuantity = 20, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 178, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Bosch Bulaşık Makinesi", ShortDescription = "12 kişilik bulaşık makinesi", Description = "A+++ enerji sınıfı", Price = 8999.99m, DiscountPrice = 7999.99m, SKU = "BOSCH001", Brand = "Bosch", StockQuantity = 12, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.5, ReviewCount = 145, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Arçelik Çamaşır Makinesi", ShortDescription = "9 kg çamaşır makinesi", Description = "Inverter motor", Price = 6999.99m, SKU = "ARCELIK001", Brand = "Arçelik", StockQuantity = 18, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.3, ReviewCount = 198, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Kütahya Porselen Kahve Seti", ShortDescription = "6 kişilik kahve seti", Description = "El yapımı desen", Price = 599.99m, SKU = "KUTAHYA001", Brand = "Kütahya", StockQuantity = 65, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.1, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Madame Coco Nevresim", ShortDescription = "Çift kişilik nevresim", Description = "%100 pamuk", Price = 399.99m, DiscountPrice = 299.99m, SKU = "MCOCO001", Brand = "Madame Coco", StockQuantity = 95, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.0, ReviewCount = 345, CreatedDate = DateTime.UtcNow },
            new Product { Name = "English Home Halı", ShortDescription = "Salon halısı", Description = "120x180 cm", Price = 1299.99m, SKU = "EH001", Brand = "English Home", StockQuantity = 25, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.2, ReviewCount = 123, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Zara Home Mum", ShortDescription = "Aromaterapi mum", Description = "Lavanta kokusu", Price = 199.99m, SKU = "ZARAHOME001", Brand = "Zara Home", StockQuantity = 120, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 456, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Bambum Mutfak Seti", ShortDescription = "Bambu mutfak gereçleri", Description = "Doğal malzeme", Price = 299.99m, SKU = "BAMBUM001", Brand = "Bambum", StockQuantity = 75, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.3, ReviewCount = 189, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Korkmaz Çaydanlık", ShortDescription = "Çelik çaydanlık", Description = "Düdüklü tasarım", Price = 449.99m, DiscountPrice = 349.99m, SKU = "KORKMAZ001", Brand = "Korkmaz", StockQuantity = 85, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.1, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Schafer Bıçak Seti", ShortDescription = "Mutfak bıçak seti", Description = "6 parça set", Price = 699.99m, SKU = "SCHAFER001", Brand = "Schafer", StockQuantity = 60, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.5, ReviewCount = 167, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Kütahya Bardak Seti", ShortDescription = "Çay bardağı seti", Description = "6'lı set", Price = 199.99m, SKU = "KUTAHYA002", Brand = "Kütahya", StockQuantity = 100, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.0, ReviewCount = 289, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Creavit Klozet", ShortDescription = "Asma klozet", Description = "Soft close kapak", Price = 1299.99m, SKU = "CREAVIT001", Brand = "Creavit", StockQuantity = 30, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.2, ReviewCount = 89, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Kale Banyo Seti", ShortDescription = "Banyo aksesuarları", Description = "5 parça set", Price = 599.99m, DiscountPrice = 449.99m, SKU = "KALE001", Brand = "Kale", StockQuantity = 55, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.1, ReviewCount = 156, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Keramika Vazo", ShortDescription = "Dekoratif vazo", Description = "El yapımı seramik", Price = 299.99m, SKU = "KERAMIKA001", Brand = "Keramika", StockQuantity = 80, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.3, ReviewCount = 145, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Linens Havlu Seti", ShortDescription = "Banyo havlu seti", Description = "%100 pamuk", Price = 399.99m, SKU = "LINENS001", Brand = "Linens", StockQuantity = 70, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.2, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Taç Yorgan", ShortDescription = "Kış yorganı", Description = "Çift kişilik", Price = 899.99m, DiscountPrice = 699.99m, SKU = "TAC001", Brand = "Taç", StockQuantity = 45, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 178, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Özdilek Perde", ShortDescription = "Salon perdesi", Description = "Blackout özellik", Price = 699.99m, SKU = "OZDILEK001", Brand = "Özdilek", StockQuantity = 35, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.1, ReviewCount = 123, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Vivense Sehpa", ShortDescription = "Orta sehpa", Description = "Modern tasarım", Price = 1599.99m, SKU = "VIVENSE001", Brand = "Vivense", StockQuantity = 25, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.3, ReviewCount = 89, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Modalife Gardırop", ShortDescription = "3 kapılı gardırop", Description = "Aynalı kapak", Price = 4999.99m, DiscountPrice = 4299.99m, SKU = "MODALIFE001", Brand = "Modalife", StockQuantity = 12, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.2, ReviewCount = 67, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Istikbal Yatak", ShortDescription = "Ortopedik yatak", Description = "Çift kişilik", Price = 3999.99m, SKU = "ISTIKBAL001", Brand = "İstikbal", StockQuantity = 20, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.5, ReviewCount = 156, CreatedDate = DateTime.UtcNow }
        };
    }

    private static List<Product> GetSporProducts(int categoryId)
    {
        return new List<Product>
        {
            new Product { Name = "Nike Air Zoom Pegasus", ShortDescription = "Koşu ayakkabısı", Description = "Zoom Air teknolojisi", Price = 3299.99m, DiscountPrice = 2799.99m, SKU = "NIKE002", Brand = "Nike", StockQuantity = 75, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.7, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Adidas Alphaedge 4D", ShortDescription = "Teknolojik koşu ayakkabısı", Description = "3D baskı tabanlık", Price = 4999.99m, SKU = "ADIDAS002", Brand = "Adidas", StockQuantity = 45, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 156, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Under Armour Tişört", ShortDescription = "Spor tişört", Description = "Nem emici kumaş", Price = 599.99m, DiscountPrice = 449.99m, SKU = "UA001", Brand = "Under Armour", StockQuantity = 120, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 345, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Reebok CrossFit Ayakkabı", ShortDescription = "CrossFit ayakkabısı", Description = "Çok amaçlı antrenman", Price = 2799.99m, SKU = "REEBOK001", Brand = "Reebok", StockQuantity = 60, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.5, ReviewCount = 189, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Wilson Tenis Raketi", ShortDescription = "Profesyonel tenis raketi", Description = "Karbon fiber", Price = 1899.99m, DiscountPrice = 1599.99m, SKU = "WILSON001", Brand = "Wilson", StockQuantity = 35, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 123, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Spalding Basketbol Topu", ShortDescription = "Resmi basketbol topu", Description = "NBA onaylı", Price = 399.99m, SKU = "SPALDING001", Brand = "Spalding", StockQuantity = 85, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.3, ReviewCount = 267, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Decathlon Yoga Matı", ShortDescription = "Kaymaz yoga matı", Description = "6mm kalınlık", Price = 299.99m, SKU = "DECATHLON001", Brand = "Decathlon", StockQuantity = 100, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.2, ReviewCount = 456, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Domyos Dumbbell Seti", ShortDescription = "Ayarlanabilir dumbbell", Description = "2-20kg arası", Price = 1299.99m, DiscountPrice = 999.99m, SKU = "DOMYOS001", Brand = "Domyos", StockQuantity = 45, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.5, ReviewCount = 178, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Garmin Forerunner 245", ShortDescription = "GPS koşu saati", Description = "Nabız monitörü", Price = 5999.99m, SKU = "GARMIN001", Brand = "Garmin", StockQuantity = 25, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.7, ReviewCount = 145, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Fitbit Charge 5", ShortDescription = "Fitness tracker", Description = "Kalp ritmi takibi", Price = 3499.99m, DiscountPrice = 2999.99m, SKU = "FITBIT001", Brand = "Fitbit", StockQuantity = 55, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Polar H10", ShortDescription = "Kalp ritmi sensörü", Description = "Bluetooth bağlantı", Price = 899.99m, SKU = "POLAR001", Brand = "Polar", StockQuantity = 40, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 123, CreatedDate = DateTime.UtcNow },
            new Product { Name = "TRX Suspension Trainer", ShortDescription = "Asma antrenman sistemi", Description = "Vücut ağırlığı antrenmanı", Price = 1499.99m, SKU = "TRX001", Brand = "TRX", StockQuantity = 30, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.5, ReviewCount = 189, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Kettlebell 16kg", ShortDescription = "Cast iron kettlebell", Description = "Fonksiyonel antrenman", Price = 599.99m, DiscountPrice = 499.99m, SKU = "KETTLE001", Brand = "Generic", StockQuantity = 65, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.3, ReviewCount = 156, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Speedo Mayo", ShortDescription = "Yarış mayosu", Description = "Hidrodinamik tasarım", Price = 799.99m, SKU = "SPEEDO001", Brand = "Speedo", StockQuantity = 80, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.2, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Arena Yüzücü Gözlüğü", ShortDescription = "Profesyonel yüzücü gözlüğü", Description = "Anti-fog özellik", Price = 299.99m, SKU = "ARENA001", Brand = "Arena", StockQuantity = 90, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 345, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Salomon Koşu Ayakkabısı", ShortDescription = "Trail koşu ayakkabısı", Description = "Dağ koşusu için", Price = 3799.99m, SKU = "SALOMON001", Brand = "Salomon", StockQuantity = 40, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 123, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Merrell Hiking Bot", ShortDescription = "Dağcılık botu", Description = "Su geçirmez", Price = 2999.99m, DiscountPrice = 2499.99m, SKU = "MERRELL001", Brand = "Merrell", StockQuantity = 50, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 189, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Columbia Outdoor Ceket", ShortDescription = "Su geçirmez ceket", Description = "Omni-Tech teknoloji", Price = 1999.99m, SKU = "COLUMBIA002", Brand = "Columbia", StockQuantity = 35, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.5, ReviewCount = 167, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Patagonia Fleece", ShortDescription = "Polar fleece", Description = "Geri dönüştürülmüş malzeme", Price = 1599.99m, DiscountPrice = 1299.99m, SKU = "PATAGONIA001", Brand = "Patagonia", StockQuantity = 45, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.7, ReviewCount = 145, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Deuter Sırt Çantası", ShortDescription = "Hiking sırt çantası", Description = "40L kapasité", Price = 1299.99m, SKU = "DEUTER001", Brand = "Deuter", StockQuantity = 30, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 123, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Black Diamond Tırmanış Ayakkabısı", ShortDescription = "Kaya tırmanış ayakkabısı", Description = "Hassas tutuş", Price = 2199.99m, SKU = "BD001", Brand = "Black Diamond", StockQuantity = 25, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 89, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Petzl Kask", ShortDescription = "Tırmanış kaskı", Description = "Güvenlik sertifikalı", Price = 899.99m, DiscountPrice = 749.99m, SKU = "PETZL001", Brand = "Petzl", StockQuantity = 40, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.5, ReviewCount = 156, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Rossignol Kayak", ShortDescription = "All-mountain kayak", Description = "Orta seviye", Price = 8999.99m, SKU = "ROSSIGNOL001", Brand = "Rossignol", StockQuantity = 15, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.7, ReviewCount = 67, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Burton Snowboard", ShortDescription = "Freestyle snowboard", Description = "Park ve pipe için", Price = 6999.99m, DiscountPrice = 5999.99m, SKU = "BURTON001", Brand = "Burton", StockQuantity = 20, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 89, CreatedDate = DateTime.UtcNow },
            new Product { Name = "Atomic Kayak Botu", ShortDescription = "Kayak botu", Description = "Comfort fit", Price = 3999.99m, SKU = "ATOMIC001", Brand = "Atomic", StockQuantity = 25, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 123, CreatedDate = DateTime.UtcNow }
        };
    }

    private static async Task SeedProductImages(SepetzaDbContext context)
    {
        var products = await context.Products.ToListAsync();
        var productImages = new List<ProductImage>();

        // Kategori bazında resim URL'leri
        var imageUrls = new Dictionary<string, List<string>>
        {
            // Elektronik ürünleri
            ["telefon"] = new List<string>
            {
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=400&h=400&fit=crop"
            },
            ["bilgisayar"] = new List<string>
            {
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop"
            },
            ["kulaklık"] = new List<string>
            {
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&h=400&fit=crop"
            },
            ["gaming"] = new List<string>
            {
                "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=400&fit=crop"
            },
            ["kamera"] = new List<string>
            {
                "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop"
            },
            // Giyim ürünleri
            ["kadın"] = new List<string>
            {
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400&h=400&fit=crop"
            },
            ["erkek"] = new List<string>
            {
                "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop"
            },
            ["ayakkabı"] = new List<string>
            {
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop"
            },
            ["çanta"] = new List<string>
            {
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop"
            },
            ["outdoor"] = new List<string>
            {
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1578662015808-cd5bd625d52b?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1586022688687-c52b2d5b7a6c?w=400&h=400&fit=crop"
            },
            // Ev & Yaşam
            ["mobilya"] = new List<string>
            {
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop"
            },
            ["mutfak"] = new List<string>
            {
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop"
            },
            ["banyo"] = new List<string>
            {
                "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1564540574859-0dfb63985953?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1584622781564-1d987baa0a74?w=400&h=400&fit=crop"
            },
            ["tekstil"] = new List<string>
            {
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=400&h=400&fit=crop"
            },
            ["dekorasyon"] = new List<string>
            {
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop"
            },
            // Spor & Outdoor
            ["spor"] = new List<string>
            {
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop"
            }
        };

        foreach (var product in products)
        {
            var categoryImages = GetCategoryImages(product.Name, imageUrls);
            var imageCount = Math.Min(categoryImages.Count, 3);
            
            for (int i = 0; i < imageCount; i++)
            {
                productImages.Add(new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = categoryImages[i],
                    AltText = $"{product.Name} - Görsel {i + 1}",
                    DisplayOrder = i + 1,
                    IsMain = i == 0,
                    CreatedDate = DateTime.UtcNow
                });
            }
        }

        await context.ProductImages.AddRangeAsync(productImages);
        await context.SaveChangesAsync();
        Console.WriteLine($"✅ {productImages.Count} product images seeded successfully");
    }

    private static List<string> GetCategoryImages(string productName, Dictionary<string, List<string>> imageUrls)
    {
        var name = productName.ToLower();
        
        // Spesifik ürün resimleri - Her ürün için özel resimler
        var specificImages = new Dictionary<string, List<string>>
        {
            // Elektronik - Telefon & Tablet
            ["iphone 15 pro"] = new List<string> { 
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=400&h=400&fit=crop&q=80" 
            },
            ["samsung galaxy s24"] = new List<string> { 
                "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=400&h=400&fit=crop&q=80" 
            },
            ["ipad pro"] = new List<string> { 
                "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop&q=80" 
            },
            ["samsung galaxy tab"] = new List<string> { 
                "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop&q=80" 
            },
            ["xiaomi mi 13"] = new List<string> { 
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop&q=80" 
            },

            // Elektronik - Bilgisayar
            ["macbook air"] = new List<string> { 
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&q=80" 
            },
            ["dell xps"] = new List<string> { 
                "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&q=80" 
            },
            ["hp pavilion"] = new List<string> { 
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&q=80" 
            },
            ["logitech mx master"] = new List<string> { 
                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=400&h=400&fit=crop&q=80" 
            },
            ["samsung 4k monitor"] = new List<string> { 
                "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&q=80" 
            },

            // Elektronik - Ses & Görüntü
            ["sony wh-1000xm5"] = new List<string> { 
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&q=80" 
            },
            ["airpods pro"] = new List<string> { 
                "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&h=400&fit=crop&q=80" 
            },
            ["lg oled"] = new List<string> { 
                "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop&q=80" 
            },
            ["jbl charge"] = new List<string> { 
                "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=400&h=400&fit=crop&q=80" 
            },
            ["bose quietcomfort"] = new List<string> { 
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&q=80" 
            },

            // Elektronik - Gaming
            ["playstation 5"] = new List<string> { 
                "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=400&fit=crop&q=80" 
            },
            ["xbox series x"] = new List<string> { 
                "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=400&fit=crop&q=80" 
            },
            ["nintendo switch"] = new List<string> { 
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop&q=80" 
            },
            ["asus rog"] = new List<string> { 
                "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&q=80" 
            },
            ["corsair k95"] = new List<string> { 
                "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400&h=400&fit=crop&q=80" 
            },

            // Elektronik - Kamera
            ["canon eos r6"] = new List<string> { 
                "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&q=80" 
            },
            ["sony alpha a7"] = new List<string> { 
                "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop&q=80" 
            },
            ["nikon z6"] = new List<string> { 
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&q=80" 
            },
            ["gopro hero"] = new List<string> { 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1586022688687-c52b2d5b7a6c?w=400&h=400&fit=crop&q=80" 
            },
            ["dji pocket"] = new List<string> { 
                "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&q=80" 
            },

            // Giyim - Kadın
            ["zara blazer"] = new List<string> { 
                "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&q=80" 
            },
            ["mango elbise"] = new List<string> { 
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&q=80" 
            },
            ["bershka crop"] = new List<string> { 
                "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&q=80" 
            },
            ["stradivarius etek"] = new List<string> { 
                "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&q=80" 
            },
            ["koton elbise"] = new List<string> { 
                "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&q=80" 
            },

            // Giyim - Erkek
            ["tommy hilfiger polo"] = new List<string> { 
                "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80" 
            },
            ["levi's 501"] = new List<string> { 
                "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop&q=80" 
            },
            ["ralph lauren gömlek"] = new List<string> { 
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop&q=80" 
            },
            ["gap hoodie"] = new List<string> { 
                "https://images.unsplash.com/photo-1556821840-3a9fbc86339e?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop&q=80" 
            },
            ["massimo dutti takım"] = new List<string> { 
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop&q=80" 
            },

            // Giyim - Ayakkabı
            ["nike air max"] = new List<string> { 
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop&q=80" 
            },
            ["adidas ultraboost"] = new List<string> { 
                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&q=80" 
            },
            ["converse chuck taylor"] = new List<string> { 
                "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&q=80" 
            },
            ["vans old skool"] = new List<string> { 
                "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80" 
            },
            ["puma suede"] = new List<string> { 
                "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80" 
            },

            // Giyim - Çanta & Aksesuar
            ["louis vuitton çanta"] = new List<string> { 
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&q=80" 
            },
            ["guess kemer"] = new List<string> { 
                "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&q=80" 
            },
            ["chanel çanta"] = new List<string> { 
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&q=80" 
            },
            ["hermes kemer"] = new List<string> { 
                "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&q=80" 
            },
            ["ray-ban güneş"] = new List<string> { 
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop&q=80" 
            },

            // Giyim - Outdoor
            ["the north face mont"] = new List<string> { 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662015808-cd5bd625d52b?w=400&h=400&fit=crop&q=80" 
            },
            ["columbia yelek"] = new List<string> { 
                "https://images.unsplash.com/photo-1586022688687-c52b2d5b7a6c?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80" 
            },
            ["patagonia mont"] = new List<string> { 
                "https://images.unsplash.com/photo-1578662015808-cd5bd625d52b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1586022688687-c52b2d5b7a6c?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80" 
            },
            ["mammut softshell"] = new List<string> { 
                "https://images.unsplash.com/photo-1586022688687-c52b2d5b7a6c?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662015808-cd5bd625d52b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80" 
            },
            ["arc'teryx beta"] = new List<string> { 
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662015808-cd5bd625d52b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1586022688687-c52b2d5b7a6c?w=400&h=400&fit=crop&q=80" 
            },

            // Ev & Yaşam - Mobilya
            ["ikea kivik"] = new List<string> { 
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&q=80" 
            },
            ["bellona yatak"] = new List<string> { 
                "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80" 
            },

            // Ev & Yaşam - Mutfak
            ["tefal tava"] = new List<string> { 
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&q=80" 
            },
            ["karaca yemek"] = new List<string> { 
                "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80" 
            },
            ["philips hava fritözü"] = new List<string> { 
                "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&q=80" 
            },
            ["dyson v15"] = new List<string> { 
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80" 
            },
            ["bosch bulaşık"] = new List<string> { 
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&q=80" 
            },
            ["arçelik çamaşır"] = new List<string> { 
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&q=80" 
            },

            // Ev & Yaşam - Banyo & Tekstil
            ["kütahya porselen"] = new List<string> { 
                "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80" 
            },
            ["madame coco nevresim"] = new List<string> { 
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop&q=80" 
            },
            ["english home halı"] = new List<string> { 
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop&q=80" 
            },

            // Spor & Outdoor - Fitness
            ["nike air zoom"] = new List<string> { 
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&q=80" 
            },
            ["adidas alphaedge"] = new List<string> { 
                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop&q=80" 
            },
            ["garmin forerunner"] = new List<string> { 
                "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop&q=80" 
            },
            ["fitbit charge"] = new List<string> { 
                "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop&q=80" 
            },
            ["under armour"] = new List<string> { 
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&q=80" 
            },
            
            // Spor & Outdoor - Koşu
            ["brooks ghost"] = new List<string> { 
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&q=80" 
            },
            ["asics gel"] = new List<string> { 
                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop&q=80" 
            },
            ["new balance fresh"] = new List<string> { 
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop&q=80" 
            },
            ["polar vantage"] = new List<string> { 
                "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop&q=80" 
            },
            ["nike dri-fit"] = new List<string> { 
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&q=80" 
            },
            
            // Spor & Outdoor - Outdoor
            ["the north face"] = new List<string> { 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662015808-cd5bd625d52b?w=400&h=400&fit=crop&q=80" 
            },
            ["patagonia"] = new List<string> { 
                "https://images.unsplash.com/photo-1586022688687-c52b2d5b7a6c?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80" 
            },
            ["columbia"] = new List<string> { 
                "https://images.unsplash.com/photo-1578662015808-cd5bd625d52b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1586022688687-c52b2d5b7a6c?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80" 
            },
            ["merrell"] = new List<string> { 
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80" 
            },
            ["salomon"] = new List<string> { 
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1586022688687-c52b2d5b7a6c?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80" 
            },
            
            // Spor & Outdoor - Su Sporları
            ["speedo"] = new List<string> { 
                "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop&q=80" 
            },
            ["arena"] = new List<string> { 
                "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop&q=80" 
            },
            ["tyr"] = new List<string> { 
                "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop&q=80" 
            },
            ["aqua sphere"] = new List<string> { 
                "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop&q=80" 
            },
            ["cressi"] = new List<string> { 
                "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=400&fit=crop&q=80" 
            },
            
            // Spor & Outdoor - Kış Sporları
            ["rossignol"] = new List<string> { 
                "https://images.unsplash.com/photo-1551524164-6cf2ac531c3d?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80" 
            },
            ["salomon ski"] = new List<string> { 
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551524164-6cf2ac531c3d?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80" 
            },
            ["atomic"] = new List<string> { 
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551524164-6cf2ac531c3d?w=400&h=400&fit=crop&q=80" 
            },
            ["burton"] = new List<string> { 
                "https://images.unsplash.com/photo-1586022688687-c52b2d5b7a6c?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1578662015808-cd5bd625d52b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551524164-6cf2ac531c3d?w=400&h=400&fit=crop&q=80" 
            },
            ["k2"] = new List<string> { 
                "https://images.unsplash.com/photo-1578662015808-cd5bd625d52b?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1586022688687-c52b2d5b7a6c?w=400&h=400&fit=crop&q=80", 
                "https://images.unsplash.com/photo-1551524164-6cf2ac531c3d?w=400&h=400&fit=crop&q=80" 
            }
        };

        // Önce spesifik ürün adını kontrol et
        foreach (var specificProduct in specificImages.Keys)
        {
            if (name.Contains(specificProduct))
            {
                return specificImages[specificProduct];
            }
        }

        // Spesifik bulunamazsa genel kategori resimleri kullan
        if (name.Contains("iphone") || name.Contains("samsung") || name.Contains("xiaomi") || name.Contains("ipad") || name.Contains("tablet"))
            return imageUrls["telefon"];
        else if (name.Contains("macbook") || name.Contains("laptop") || name.Contains("dell") || name.Contains("hp") || name.Contains("mouse") || name.Contains("monitor"))
            return imageUrls["bilgisayar"];
        else if (name.Contains("sony") || name.Contains("airpods") || name.Contains("kulaklık") || name.Contains("hoparlör") || name.Contains("bose") || name.Contains("jbl"))
            return imageUrls["kulaklık"];
        else if (name.Contains("playstation") || name.Contains("xbox") || name.Contains("nintendo") || name.Contains("gaming") || name.Contains("asus") || name.Contains("corsair"))
            return imageUrls["gaming"];
        else if (name.Contains("canon") || name.Contains("nikon") || name.Contains("gopro") || name.Contains("dji") || name.Contains("kamera"))
            return imageUrls["kamera"];
        else if (name.Contains("zara") || name.Contains("mango") || name.Contains("bershka") || name.Contains("elbise") || name.Contains("blazer") || name.Contains("etek"))
            return imageUrls["kadın"];
        else if (name.Contains("tommy") || name.Contains("levi") || name.Contains("ralph") || name.Contains("gap") || name.Contains("massimo") || name.Contains("polo") || name.Contains("gömlek"))
            return imageUrls["erkek"];
        else if (name.Contains("nike") || name.Contains("adidas") || name.Contains("converse") || name.Contains("vans") || name.Contains("ayakkabı"))
            return imageUrls["ayakkabı"];
        else if (name.Contains("louis") || name.Contains("guess") || name.Contains("çanta") || name.Contains("kemer"))
            return imageUrls["çanta"];
        else if (name.Contains("north face") || name.Contains("columbia") || name.Contains("mont") || name.Contains("yelek"))
            return imageUrls["outdoor"];
        else if (name.Contains("ikea") || name.Contains("bellona") || name.Contains("koltuk") || name.Contains("yatak") || name.Contains("gardırop") || name.Contains("sehpa"))
            return imageUrls["mobilya"];
        else if (name.Contains("tefal") || name.Contains("karaca") || name.Contains("philips") || name.Contains("bosch") || name.Contains("tava") || name.Contains("fritöz") || name.Contains("bulaşık"))
            return imageUrls["mutfak"];
        else if (name.Contains("creavit") || name.Contains("kale") || name.Contains("klozet") || name.Contains("banyo") || name.Contains("havlu"))
            return imageUrls["banyo"];
        else if (name.Contains("nevresim") || name.Contains("halı") || name.Contains("yorgan") || name.Contains("perde") || name.Contains("taç") || name.Contains("özdilek"))
            return imageUrls["tekstil"];
        else if (name.Contains("mum") || name.Contains("vazo") || name.Contains("dekor"))
            return imageUrls["dekorasyon"];
        else
            return imageUrls["spor"];
    }

    // Eksik metodlar - basit ürün listeleri
    private static List<Product> GetErkekGiyimProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Tommy Hilfiger Polo", ShortDescription = "Erkek polo tişört", Description = "Klasik polo tasarım", Price = 799.99m, SKU = "TOMMY_POLO_001", Brand = "Tommy Hilfiger", StockQuantity = 75, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.3, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Levi's 501 Jeans", ShortDescription = "Klasik kot pantolon", Description = "Orijinal fit, %100 pamuk", Price = 1299.99m, SKU = "LEVIS_JEANS_001", Brand = "Levi's", StockQuantity = 120, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 456, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Ralph Lauren Gömlek", ShortDescription = "Erkek gömlek", Description = "Oxford pamuk", Price = 1799.99m, DiscountPrice = 1499.99m, SKU = "RL_SHIRT_001", Brand = "Ralph Lauren", StockQuantity = 40, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 123, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Gap Hoodie", ShortDescription = "Kapüşonlu sweatshirt", Description = "Fleece astar", Price = 999.99m, SKU = "GAP_HOODIE_001", Brand = "Gap", StockQuantity = 80, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.1, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Massimo Dutti Takım", ShortDescription = "Erkek takım elbise", Description = "Yün karışımı", Price = 4999.99m, SKU = "MD_SUIT_001", Brand = "Massimo Dutti", StockQuantity = 25, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.7, ReviewCount = 89, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetAyakkabiProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Nike Air Max 270", ShortDescription = "Spor ayakkabı", Description = "Rahat ve şık tasarım", Price = 3499.99m, DiscountPrice = 2999.99m, SKU = "NIKE_AIRMAX_001", Brand = "Nike", StockQuantity = 80, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.6, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Adidas Ultraboost 22", ShortDescription = "Koşu ayakkabısı", Description = "Boost teknolojisi", Price = 4299.99m, SKU = "ADIDAS_ULTRA_001", Brand = "Adidas", StockQuantity = 65, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.7, ReviewCount = 189, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Converse Chuck Taylor", ShortDescription = "Kanvas ayakkabı", Description = "Klasik tasarım", Price = 1599.99m, SKU = "CONVERSE_CHUCK_001", Brand = "Converse", StockQuantity = 95, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 423, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Vans Old Skool", ShortDescription = "Skate ayakkabısı", Description = "Dayanıklı süet", Price = 1799.99m, SKU = "VANS_OLDSKOOL_001", Brand = "Vans", StockQuantity = 70, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.5, ReviewCount = 234, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetCantaAksesuarProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Louis Vuitton Çanta", ShortDescription = "Luxury el çantası", Description = "Deri çanta", Price = 15999.99m, SKU = "LV_BAG_001", Brand = "Louis Vuitton", StockQuantity = 15, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 89, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Guess Kemer", ShortDescription = "Deri kemer", Description = "Ayarlanabilir", Price = 599.99m, SKU = "GUESS_BELT_001", Brand = "Guess", StockQuantity = 60, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.2, ReviewCount = 145, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetOutdoorGiyimProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "The North Face Mont", ShortDescription = "Kış montu", Description = "Su geçirmez", Price = 3999.99m, DiscountPrice = 3499.99m, SKU = "TNF_JACKET_001", Brand = "The North Face", StockQuantity = 35, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 167, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Columbia Yelek", ShortDescription = "Outdoor yelek", Description = "Hafif ve sıcak", Price = 1899.99m, SKU = "COLUMBIA_VEST_001", Brand = "Columbia", StockQuantity = 55, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.3, ReviewCount = 89, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetMobilyaProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "IKEA Kivik Koltuk", ShortDescription = "3'lü kanepe", Description = "Rahat oturma deneyimi", Price = 8999.99m, DiscountPrice = 7999.99m, SKU = "IKEA_SOFA_001", Brand = "IKEA", StockQuantity = 15, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.5, ReviewCount = 123, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Bellona Yatak Odası", ShortDescription = "Komplet yatak odası", Description = "Modern tasarım", Price = 15999.99m, SKU = "BELLONA_BEDROOM_001", Brand = "Bellona", StockQuantity = 8, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.3, ReviewCount = 67, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetMutfakProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Tefal Tava Seti", ShortDescription = "Yapışmaz tava seti", Description = "3 parça tava", Price = 899.99m, DiscountPrice = 699.99m, SKU = "TEFAL_PAN_001", Brand = "Tefal", StockQuantity = 85, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Philips Hava Fritözü", ShortDescription = "Yağsız pişirme", Description = "4.1L kapasité", Price = 2499.99m, DiscountPrice = 1999.99m, SKU = "PHILIPS_AIRFRYER_001", Brand = "Philips", StockQuantity = 35, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.6, ReviewCount = 289, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetBanyoProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Creavit Klozet", ShortDescription = "Asma klozet", Description = "Soft close kapak", Price = 1299.99m, SKU = "CREAVIT_WC_001", Brand = "Creavit", StockQuantity = 30, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.2, ReviewCount = 89, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetTekstilProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Madame Coco Nevresim", ShortDescription = "Çift kişilik nevresim", Description = "%100 pamuk", Price = 399.99m, DiscountPrice = 299.99m, SKU = "MCOCO_BEDDING_001", Brand = "Madame Coco", StockQuantity = 95, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.0, ReviewCount = 345, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetDekorasyonProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Zara Home Mum", ShortDescription = "Aromaterapi mum", Description = "Lavanta kokusu", Price = 199.99m, SKU = "ZARAHOME_CANDLE_001", Brand = "Zara Home", StockQuantity = 120, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.4, ReviewCount = 456, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetFitnessProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Domyos Dumbbell Seti", ShortDescription = "Ayarlanabilir dumbbell", Description = "2-20kg arası", Price = 1299.99m, DiscountPrice = 999.99m, SKU = "DOMYOS_DUMBBELL_001", Brand = "Domyos", StockQuantity = 45, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.5, ReviewCount = 178, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetKosuProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Nike Air Zoom Pegasus", ShortDescription = "Koşu ayakkabısı", Description = "Zoom Air teknolojisi", Price = 3299.99m, DiscountPrice = 2799.99m, SKU = "NIKE_PEGASUS_001", Brand = "Nike", StockQuantity = 75, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.7, ReviewCount = 234, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetOutdoorProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Salomon Koşu Ayakkabısı", ShortDescription = "Trail koşu ayakkabısı", Description = "Dağ koşusu için", Price = 3799.99m, SKU = "SALOMON_TRAIL_001", Brand = "Salomon", StockQuantity = 40, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 123, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetSuSporlariProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Speedo Mayo", ShortDescription = "Yarış mayosu", Description = "Hidrodinamik tasarım", Price = 799.99m, SKU = "SPEEDO_SWIMSUIT_001", Brand = "Speedo", StockQuantity = 80, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.2, ReviewCount = 234, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetKisSporlariProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Rossignol Kayak", ShortDescription = "All-mountain kayak", Description = "Orta seviye", Price = 8999.99m, SKU = "ROSSIGNOL_SKI_001", Brand = "Rossignol", StockQuantity = 15, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.7, ReviewCount = 67, CreatedDate = DateTime.UtcNow }
    };

    // Kitap & Medya Ürünleri
    private static List<Product> GetKitaplarProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Suç ve Ceza", ShortDescription = "Dostoyevski klasiği", Description = "Dünya edebiyatının başyapıtı", Price = 45.99m, DiscountPrice = 35.99m, SKU = "BOOK001", Brand = "İş Bankası Yayınları", StockQuantity = 150, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Sapiens", ShortDescription = "Yuval Noah Harari", Description = "İnsanlığın kısa tarihi", Price = 65.99m, DiscountPrice = 55.99m, SKU = "BOOK002", Brand = "Kolektif Kitap", StockQuantity = 120, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.9, ReviewCount = 456, CreatedDate = DateTime.UtcNow },
        new Product { Name = "1984", ShortDescription = "George Orwell", Description = "Distopya romanı", Price = 39.99m, SKU = "BOOK003", Brand = "Can Yayınları", StockQuantity = 200, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.7, ReviewCount = 189, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetMuzikProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Sezen Aksu - En İyileri", ShortDescription = "Sezen Aksu albümü", Description = "Türk pop müziğinin kraliçesi", Price = 89.99m, DiscountPrice = 69.99m, SKU = "CD001", Brand = "Sony Music", StockQuantity = 45, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 123, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Barış Manço - Koleksiyon", ShortDescription = "Barış Manço albümü", Description = "Anadolu rock efsanesi", Price = 79.99m, SKU = "CD002", Brand = "Universal Music", StockQuantity = 35, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.9, ReviewCount = 89, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetFilmProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Babam ve Oğlum - DVD", ShortDescription = "Çağan Irmak filmi", Description = "Türk sinemasının başyapıtı", Price = 49.99m, DiscountPrice = 39.99m, SKU = "DVD001", Brand = "Medyavizyon", StockQuantity = 80, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.9, ReviewCount = 345, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Ayla - Blu-ray", ShortDescription = "Can Ulkay filmi", Description = "Kore Savaşı dramı", Price = 79.99m, SKU = "BLURAY001", Brand = "TME Films", StockQuantity = 50, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.8, ReviewCount = 189, CreatedDate = DateTime.UtcNow }
    };

    // Oyuncak & Hobi Ürünleri
    private static List<Product> GetCocukOyuncakProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "LEGO City Polis Merkezi", ShortDescription = "LEGO yapım seti", Description = "374 parça LEGO seti", Price = 899.99m, DiscountPrice = 749.99m, SKU = "LEGO001", Brand = "LEGO", StockQuantity = 35, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 123, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Barbie Dreamhouse", ShortDescription = "Barbie evi", Description = "3 katlı rüya evi", Price = 1299.99m, DiscountPrice = 999.99m, SKU = "BARBIE001", Brand = "Mattel", StockQuantity = 20, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.6, ReviewCount = 89, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetPuzzleProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Ravensburger 1000 Parça Puzzle", ShortDescription = "Manzara puzzle", Description = "Yetişkin puzzle", Price = 129.99m, DiscountPrice = 99.99m, SKU = "PUZZLE001", Brand = "Ravensburger", StockQuantity = 60, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Rubik Küp", ShortDescription = "Zeka küpü", Description = "Klasik 3x3 Rubik küp", Price = 89.99m, SKU = "RUBIK001", Brand = "Rubik's", StockQuantity = 100, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.4, ReviewCount = 345, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetHobiProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Aquarelle Sulu Boya Seti", ShortDescription = "Sulu boya takımı", Description = "24 renk sulu boya", Price = 199.99m, DiscountPrice = 159.99m, SKU = "PAINT001", Brand = "Faber-Castell", StockQuantity = 40, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.7, ReviewCount = 123, CreatedDate = DateTime.UtcNow }
    };

    // Kozmetik & Bakım Ürünleri
    private static List<Product> GetMakyajProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "MAC Ruby Woo Ruj", ShortDescription = "Klasik kırmızı ruj", Description = "Mat finish ruj", Price = 449.99m, DiscountPrice = 399.99m, SKU = "MAC001", Brand = "MAC", StockQuantity = 50, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 234, CreatedDate = DateTime.UtcNow },
        new Product { Name = "Maybelline Maskara", ShortDescription = "Hacim veren maskara", Description = "Lash Sensational maskara", Price = 89.99m, SKU = "MAYBELLINE001", Brand = "Maybelline", StockQuantity = 120, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.5, ReviewCount = 456, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetCiltBakimProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "The Ordinary Niacinamide", ShortDescription = "Gözenek küçültücü serum", Description = "10% Niacinamide + 1% Zinc", Price = 199.99m, DiscountPrice = 159.99m, SKU = "ORDINARY001", Brand = "The Ordinary", StockQuantity = 80, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.6, ReviewCount = 567, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetParfumProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Chanel No. 5", ShortDescription = "Klasik kadın parfümü", Description = "Efsanevi parfüm", Price = 1899.99m, DiscountPrice = 1699.99m, SKU = "CHANEL001", Brand = "Chanel", StockQuantity = 15, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.9, ReviewCount = 123, CreatedDate = DateTime.UtcNow }
    };

    // Otomotiv Ürünleri
    private static List<Product> GetYedekParcaProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Bosch Fren Balata", ShortDescription = "Ön fren balata takımı", Description = "Audi A3 uyumlu", Price = 399.99m, DiscountPrice = 349.99m, SKU = "BOSCH001", Brand = "Bosch", StockQuantity = 30, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 89, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetOtomotivAksesuarProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Thule Tavan Çantası", ShortDescription = "Su geçirmez tavan çantası", Description = "320L hacim", Price = 1299.99m, DiscountPrice = 1099.99m, SKU = "THULE001", Brand = "Thule", StockQuantity = 15, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 67, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetBakimUrunleriProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Castrol Motor Yağı", ShortDescription = "5W-30 motor yağı", Description = "Tam sentetik motor yağı", Price = 299.99m, DiscountPrice = 249.99m, SKU = "CASTROL001", Brand = "Castrol", StockQuantity = 40, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.6, ReviewCount = 234, CreatedDate = DateTime.UtcNow }
    };

    // Bahçe & Yapı Market Ürünleri
    private static List<Product> GetBahceMalzemeProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Fiskars Budama Makası", ShortDescription = "Profesyonel budama makası", Description = "Ergonomik tasarım", Price = 399.99m, DiscountPrice = 349.99m, SKU = "FISKARS001", Brand = "Fiskars", StockQuantity = 25, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.8, ReviewCount = 89, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetElAletleriProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Bosch Akülü Matkap", ShortDescription = "18V akülü matkap", Description = "2 adet akü dahil", Price = 1299.99m, DiscountPrice = 1099.99m, SKU = "BOSCH002", Brand = "Bosch", StockQuantity = 20, CategoryId = categoryId, IsActive = true, IsFeatured = true, Rating = 4.8, ReviewCount = 123, CreatedDate = DateTime.UtcNow }
    };

    private static List<Product> GetYapiMalzemeProducts(int categoryId) => new List<Product>
    {
        new Product { Name = "Çivi Seti", ShortDescription = "Karışık çivi seti", Description = "500 adet çivi", Price = 99.99m, DiscountPrice = 79.99m, SKU = "CIVI001", Brand = "Gedik", StockQuantity = 100, CategoryId = categoryId, IsActive = true, IsFeatured = false, Rating = 4.3, ReviewCount = 234, CreatedDate = DateTime.UtcNow }
    };
} 