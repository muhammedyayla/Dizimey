1. Örnek anasayfanın dizaynı bu olacak. 
<!DOCTYPE html>

<html class="dark" lang="tr"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Dizimey - Film ve Dizi İzleme Platformu</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
<script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ea2a33",
                        "background-light": "#f8f6f6",
                        "background-dark": "#141414",
                    },
                    fontFamily: {
                        "display": ["Spline Sans", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
</head>
<body class="bg-background-light dark:bg-background-dark font-display text-white">
<div class="relative flex min-h-screen w-full flex-col">
<!-- TopNavBar -->
<header class="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap bg-background-dark/80 px-4 py-3 backdrop-blur-sm sm:px-6 md:px-10 lg:px-16">
<div class="flex items-center gap-8">
<div class="flex items-center gap-3">
<div class="size-6 text-primary">
<svg fill="currentColor" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
</svg>
</div>
<h2 class="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Dizimey</h2>
</div>
<nav class="hidden items-center gap-6 md:flex">
<a class="text-white text-sm font-medium leading-normal" href="#">Ana Sayfa</a>
<a class="text-white/70 hover:text-white transition-colors text-sm font-medium leading-normal" href="#">Diziler</a>
<a class="text-white/70 hover:text-white transition-colors text-sm font-medium leading-normal" href="#">Filmler</a>
<a class="text-white/70 hover:text-white transition-colors text-sm font-medium leading-normal" href="#">Listem</a>
</nav>
</div>
<div class="flex items-center gap-4">
<label class="relative hidden sm:flex">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/50">search</span>
<input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-black/30 h-10 placeholder:text-white/50 text-white pl-10 pr-4 text-sm font-normal leading-normal focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Ara..." value=""/>
</label>
<button class="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-black/30 text-white transition-colors hover:bg-white/10">
<span class="material-symbols-outlined">notifications</span>
</button>
<div class="bg-center bg-no-repeat aspect-square bg-cover rounded-md size-10" data-alt="User profile avatar" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVw_hT6dP2uQzNvRC1iuCpkV6vqszaZkgWJm8e5O8R5jz4gQUmnd1SGtp1UZ4kbsYJJWySCJn3lyhRVX3dKJ-UbvsxHieiazRuCjN1u3btHJL0Zq8St6EAIX_Of77qJkOKij0_xtDQ_SURgiFVF6isUJmYs53mooKIJWrYzqvZq8hPMeSDaJUEShBe-3rIGC0QyOtoK2EERX9kZKtNSp3qEAMZa5raQPFWEHvf8P7TY0iv4orth_IeMjjZQ4apa8b6S6Er6B2pZ7g");'></div>
</div>
</header>
<main class="flex-grow">
<!-- HeroSection -->
<section class="relative -mt-[72px] h-[80vh] min-h-[500px] w-full">
<div class="absolute inset-0 bg-cover bg-center bg-no-repeat" data-alt="Featured series: an epic space battle scene with vibrant laser blasts" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDx6FHTJDCaQP_T_xMp72ahG2i_vdInooguFUttISlTOltmj8Lwev24Z18lDil0g2RelO8gF3CMZopRziBFKrzYkaLIZfwILKVUZGDbyHc3tGGFr_wLaQ98QNZcrBzKA9JRsTmBMkdVlJhfDiYYgE0qMSTjyThBPQYxLindSo2W292YpKLZFRRckm2y2GBBz59AeyFqJE1iA5mwX_jPFH6cqtag4YoJQb0ctCrGtv_k-JpHJ2KTxJEVSl3W2wwA485igm6XwKhiRW4");'></div>
<div class="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-transparent"></div>
<div class="absolute inset-x-0 bottom-0 flex flex-col items-start justify-end px-4 py-10 sm:px-6 md:px-10 lg:px-16 md:py-20">
<div class="max-w-xl space-y-4">
<h1 class="text-white text-4xl font-black leading-tight tracking-tighter md:text-6xl">
                            GALAKTİK SAVAŞLAR
                        </h1>
<p class="text-white/90 text-sm font-normal leading-normal md:text-base">
                            Bu sürükleyici yeni dizide heyecan verici bir maceraya atılın. Gerilim ve dram dolu bir evren sizi bekliyor.
                        </p>
<div class="flex flex-wrap gap-3 pt-2">
<button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
<span class="material-symbols-outlined">play_arrow</span>
<span class="truncate">Oynat</span>
</button>
<button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md h-12 px-5 bg-white/20 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/30 transition-colors">
<span class="material-symbols-outlined">info</span>
<span class="truncate">Daha Fazla Bilgi</span>
</button>
</div>
</div>
</div>
</section>
<!-- Content Rows -->
<div class="flex flex-col space-y-12 py-10">
<!-- Carousel: Bugünün Top 10 Türkiye'de -->
<section>
<h3 class="px-4 text-xl font-bold text-white sm:px-6 md:px-10 lg:px-16 mb-2">Bugünün Top 10 Türkiye'de</h3>
<div class="relative">
<div class="overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
<div class="flex items-stretch gap-3 px-4 sm:px-6 md:px-10 lg:px-16">
<div class="group flex flex-shrink-0 items-center">
<span class="text-[12rem] font-black text-white/80" style="text-shadow: -8px 0px 0px #141414;">1</span>
<div class="w-40 bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-md -ml-12 transition-transform duration-300 group-hover:scale-105" data-alt="Poster for the top-rated movie today" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwLikpjEOKuzk3c0Ow4jogEXb1luOI76EAONr5DPayywdm5LYMSDchqoTBn3kvPiMUEGb0b65kP1NXLoSnLaXmHGDvplz2_IWsGLH2LWtMLSzBHHCAGqU7ZUKTZ0Z9t4zZZ8zMZUOAEyWqKMetNtkWel4lz4x-9dTX89CPXPoTq1KBY5tJQyuvhVvRH1Imsd3RYQ-i9ciPJsEBXj9zjf0vEs-J3UPcUbp-sut8xb4qZSkNed01ivN-bnJ-9k2okDwwqc1DydHjrks");'></div>
</div>
<div class="group flex flex-shrink-0 items-center">
<span class="text-[12rem] font-black text-white/80" style="text-shadow: -8px 0px 0px #141414;">2</span>
<div class="w-40 bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-md -ml-12 transition-transform duration-300 group-hover:scale-105" data-alt="Poster for the second top-rated movie" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXPXW3I0V3vi3sZWckWNu0jY7kyCic51r9vwxm7rCpecGVvgFafa9_FB7aKMbmLQwhXsfshUyGRqCDg9xKIkYfPOFbtabioH516i_iDFESYQMD107a9byV2k-PP6EOhYP2z6LegKNpG5DWCU1sP64L3gjKpG3RVBI-tfB6sD22bSs-RQg_p4Tw9PlZ-RFiuKFLRkEXZomPvBpLvXxU0n0dsArvn20Y_Ch7hBL3DfmDd4fR1BsTwM06ZsOja0iaTGqQHz4DmaKq4es");'></div>
</div>
<div class="group flex flex-shrink-0 items-center">
<span class="text-[12rem] font-black text-white/80" style="text-shadow: -8px 0px 0px #141414;">3</span>
<div class="w-40 bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-md -ml-12 transition-transform duration-300 group-hover:scale-105" data-alt="Poster for the third top-rated movie" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBIn0qwrqTWj3A71Dcdp3Qoq-BlUFuLialXvdH5Z9bniUR0YS7XH4_iW0EZ4QFWZIbHu5PV9wnC4TZRbcUyEiu5ZC7ylJpIvaRzhI-qmZsom5utG4dkL4RDeZy2lWizEhiKaJq-l1ISY_bQZoUguoA0cMR7c7dn4KCRpnLxiXxek3GhAk7sSEtSqs2yNPqnoSt8MddgqfEYCPzMsnuL7Gk0ocdeoyeV-LsMQ-USXTnGRA9cAKBRZgR-TfbuNyCTjqYV3FKQy5eqsdY");'></div>
</div>
<div class="group flex flex-shrink-0 items-center">
<span class="text-[12rem] font-black text-white/80" style="text-shadow: -8px 0px 0px #141414;">4</span>
<div class="w-40 bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-md -ml-12 transition-transform duration-300 group-hover:scale-105" data-alt="Poster for the fourth top-rated movie" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCCNWD7ks-34_auixmndnHfhOdI_VVJQpqVQxeuIwZP1seg9vrQGUKkZT1lmjhacHOG-XNRxt92G-fzsfFljXneY6_oc1Vd8PkCOYCXxuAi3j43SEgKOK4ulgdHfYk84vydaaGNABJ5mfYqfB-L8O1NXfWzndPDoQmS0GCM-2BWlnqD67Qmc5gy2FcjolhcGg03UU6W5tTbITJGlX_jyV9-sWNyHAb7ojea7d5pSA5NnhNU--CARJObSxOSRSqi9FDSPdaDbumLaAc");'></div>
</div>
<div class="group flex flex-shrink-0 items-center">
<span class="text-[12rem] font-black text-white/80" style="text-shadow: -8px 0px 0px #141414;">5</span>
<div class="w-40 bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-md -ml-12 transition-transform duration-300 group-hover:scale-105" data-alt="Poster for the fifth top-rated movie" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCCZbACKN2ppNSi2YzHuAf0pEjiIIEbX6oFWzweyGqT97OCYyAIahvAgVBdVLl5vRQF8puRbeBV5Z2tFm22_hmk1dsyh4TP0gCqgdElBlJo29dXGahZ7jnGVjImeoBS--CiK5x6354AmcUBjKqg12ktVZBgRTPQmMPqfcoMF2VHEVmsPawF6hSUmZXNpohnhnzFkS2ghpcdklFeNdh53YyhaYAmTlvXIetSDX-FrcikhKCjsw_H3a_i95AfvjWh0nxUUOcrC7pyRbA");'></div>
</div>
<div class="group flex flex-shrink-0 items-center">
<span class="text-[12rem] font-black text-white/80" style="text-shadow: -8px 0px 0px #141414;">6</span>
<div class="w-40 bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-md -ml-12 transition-transform duration-300 group-hover:scale-105" data-alt="Poster for the sixth top-rated movie" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZ641LPnI_mRdSd6TvL8vaOB4xFQVm1OAdiI319xGFYDqrYb2-PwhuFqsSdKVZZDRmr0ZzhCrGLTc6Lx5J9QXrxQ4ucvsOlx7qYTiAKeWiZQ5-u4N6eLPxe1bcrbjFspMxuwvzxtz79HHjAbofn6eREyo23ahBzTr7NBl4ajQ-5aXoirD4VarTeGeW9FpuqbVokXoKoBS4-0e-m9QSKLFGXHau9SnEM0fdJ1sc26or3WHlWbZ9XfMA9d5I_6VOWI58Kl7syP488yQ");'></div>
</div>
</div>
</div>
</div>
</section>
<!-- Carousel: Bugün Trend Olanlar -->
<section>
<h3 class="px-4 text-xl font-bold text-white sm:px-6 md:px-10 lg:px-16 mb-2">Bugün Trend Olanlar</h3>
<div class="overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
<div class="flex items-stretch gap-3 px-4 sm:px-6 md:px-10 lg:px-16">
<div class="group flex-shrink-0 min-w-60">
<div class="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-md flex flex-col transition-transform duration-300 group-hover:scale-105" data-alt="Thumbnail for a trending series" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBcu493GsFORHNWqlS1lVK6WclmvJ7chOVXa9_kH6sW0eGc6f6BBSYL-Wm6b8nFhQXkw-5HABakD1SVrIVKDzZMVyX6oJm3FoZkCcbNhWOJP7KJJUaOk68IN1G2hShKeb4KLMD2pPA-XsT19_ZI_yucDQNLKWiCh2zAl85-PlrBl3o4P-CUp3k4DvEWoUqiJ9M5ssKpIPhVXvk3Ua163mpUSjH1qQiH-MkCtUQFwKvgakcC8XBT5mCl4k7F3va1IX55mB080UTWLjA");'></div>
</div>
<div class="group flex-shrink-0 min-w-60">
<div class="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-md flex flex-col transition-transform duration-300 group-hover:scale-105" data-alt="Thumbnail for another trending movie" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAEljir0JX5pAUGhBphHvswM7exuTWBKBdoLdFHYbSk_BiwHK1WjRJq3JBibc0ZacGka8N1K5bYqf-E9fegonRY8W5-j5Z8m9UDvT1F5QaeXj6s9QKM_W14fPqJB0ndtosvLvKPUsnoEdu3i7qVG4amiGxyn4FL2MOsRAI7tPuRVViDFszS_2osuR_CTGxVI8UXUxgH6tF7CL-l0ix_pg0iGLJYmbx1pEMi79XcBzSi_3brUwBvloluPB6zMh11QG1ATXrALi2YzpU");'></div>
</div>
<div class="group flex-shrink-0 min-w-60">
<div class="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-md flex flex-col transition-transform duration-300 group-hover:scale-105" data-alt="Thumbnail for a trending documentary" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPjjhAp85J0IzUPDSbedOznx0pwU-_FFVE0u8gorENmWCtBafCri6Mjb1KdjOCbkF1m26Fv4M7sm0QbfqlMMdUnhpT6RI53bP4aiHwSuuVuCAczSkKAwlwT_KCsflVYL7sEmSgJsMD1dUZGMD9Y43lqTdIWnkgRpmf7y8k1AqE0GxBk2YefB2feI-kDpS6j3zXN_euoBMLkFS3OLlcZ6j56pM73JNx1lFrqanSLXbb1xngybJG7bQjpuBHgF27vbRHMiZ3XVqlQtM");'></div>
</div>
<div class="group flex-shrink-0 min-w-60">
<div class="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-md flex flex-col transition-transform duration-300 group-hover:scale-105" data-alt="Thumbnail for a popular show" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgJOmx4sJ6EL1ZMyeyh3Wj97dgGXgsbnB8nLoZxOkqNEQRyiGJipqA3zpSnTKU1Oibmf6iu8k_TxsYqUAsmHpcz9IXJGh0PVJibsI3OQe_wdOyPdTXBp15iU1xOggUz904Znfn1eZ7cMB7H8MENi9V4j_KSPdmfK3aA3sf5SKjJhOwdTNnQ0FBB7iQByjvCYYdaewx2Db8otWSuBV8Xlq4XXMqykynn96r6IGy_AoIsp5QwdQSsw1ixpNxUKhDANapi080YOp4AsI");'></div>
</div>
<div class="group flex-shrink-0 min-w-60">
<div class="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-md flex flex-col transition-transform duration-300 group-hover:scale-105" data-alt="Thumbnail for a blockbuster movie" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDRN7FicTF-GAv95jNXt_e2R7xDnz5fdDIf6EWEApvHqbkKu1LjTkHzTAnEjddtlv4vMjlTUGAeCJESzeky1uVc-kfKeGcLY8LJoL9WXV7TJVvhX8We7nPJK2dheWlfoFom76iHomDCQfmvui8VaWIjaR8vCnMRhdtX7g64zqFA09-Gu9IoMkSV66GCgHXq0i_vDhfWPXsrVm7ELYyri57aYAuDN9J2AT97UAijOfliUFMNrNWJllLhleyatUW_ijTHI9YbEJTQyz0");'></div>
</div>
</div>
</div>
</section>
<!-- Carousel: İzlemeye Devam Et -->
<section>
<h3 class="px-4 text-xl font-bold text-white sm:px-6 md:px-10 lg:px-16 mb-2">İzlemeye Devam Et</h3>
<div class="overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
<div class="flex items-stretch gap-3 px-4 sm:px-6 md:px-10 lg:px-16">
<div class="group flex-shrink-0 min-w-60">
<div class="relative w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-md flex flex-col transition-transform duration-300 group-hover:scale-105" data-alt="Thumbnail for a movie to continue watching" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDl64uElApvs-4gpsg6n008ulLjHNTiTJ9ickegLhHO8Sf_cb9aSPmPSYrfVK1YkEfz17kd4ErChMSCffGDtitXCSSemng95mkXi2e4JtKX4UdmD78LRxqmBUuO8VGxt133z1N5_CN7N5gzN-8luC76uISkpsckiKFjFEF6s2MrdUNPlA2_eaGQU98DgOzEXvGWPJDuXtez57VkOeu-dHFt2cSeHkLQYKaNjIHBt2zrC3mzEYRUumE4B7aT4_tU1UWkTS4M7gFBq5c");'>
<div class="mt-auto h-1 w-full bg-white/30 rounded-b-md">
<div class="h-1 bg-primary rounded-bl-md" style="width: 75%;"></div>
</div>
</div>
</div>
<div class="group flex-shrink-0 min-w-60">
<div class="relative w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-md flex flex-col transition-transform duration-300 group-hover:scale-105" data-alt="Thumbnail for a series to continue watching" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDK2gl4qUyfTXK0kTcxhBQQMTdjpLF94PnV9LNB9UnDZE9V4FhMztzCQLR3NEDmUH8LIA5d5Na8fqNS-7Fj0GHurcGnOGK_u7z4bhJW6a8mR2PN8NSMpzWBaVmHKB_SRIYpk5Sl6DgiXIPYA85MyGRi7-8G9bHZNy0wUN06zEfhHJtGbj-U1EQWG63gBkyk1U3VZkyXwC3ZeYYnlddsWYtPSefpcvlhFQKQUUkxaBGDM8HrUvj4ZcQ2jGB7Nvz2cixoVzetHOifxqE");'>
<div class="mt-auto h-1 w-full bg-white/30 rounded-b-md">
<div class="h-1 bg-primary rounded-bl-md" style="width: 30%;"></div>
</div>
</div>
</div>
<div class="group flex-shrink-0 min-w-60">
<div class="relative w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-md flex flex-col transition-transform duration-300 group-hover:scale-105" data-alt="Thumbnail for another show to continue watching" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBXqKQl2Bs7Aj6yVyd3L1e8N_BIL_Ov3gfPzoc0x8UjxpE-RH1TBMgGi_D1ug4j_vZp_b-LW8VyUlwRGHjt980STZhcePUN_RH9CZ_80F_vrtxVaTnHGAhYa1gS2vGqEnj91VIjhqPJg6oRVAFHN5CYCMmjhINaRseHSq21QNmCAf6kYYGlmvKiDkeTiFBt6VROEUbZ575YaeoZWplj6jEJ7RniSDfHuGsm4HL51hojsa_xdQ1BBFThfiMkv9Fistw-AXRq5aQ1v4g");'>
<div class="mt-auto h-1 w-full bg-white/30 rounded-b-md">
<div class="h-1 bg-primary rounded-bl-md" style="width: 50%;"></div>
</div>
</div>
</div>
<div class="group flex-shrink-0 min-w-60">
<div class="relative w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-md flex flex-col transition-transform duration-300 group-hover:scale-105" data-alt="Thumbnail for a film to continue watching" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuD77qlOXV29bLnakLCqcyJ91fCk-H7OJj8IG_ggzAS1MWIiT8SEqnfvpfPasCTUIf0FMPxlZXZmA8NGM8OykkksQtb98tjLG8sWN8luY8u-HplQPQ9wykO2QrG8uHxhITxkLU6L1WJQJOMAn8h-Z8AgZ_p8gy2zPupp6KhuO3zqtrL7ILFFBFmZmmxmWViPkjClByYYSCe_5JikKMrx45eaEEk1v6ANYA7jjipRkQg4fEroh42lOKSEbj2yeTHn5YeCuJP_wPfBTiE");'>
<div class="mt-auto h-1 w-full bg-white/30 rounded-b-md">
<div class="h-1 bg-primary rounded-bl-md" style="width: 90%;"></div>
</div>
</div>
</div>
</div>
</div>
</section>
</div>
</main>
</div>
</body></html>

 2. Anasayfadak bir filme tıklanınca açılan sayfanın görünümü bu olacak şeması. 

<!DOCTYPE html>

<html class="dark" lang="tr"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Dizimey - Film Detay Sayfası</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
<script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ea2a33",
                        "background-light": "#f8f6f6",
                        "background-dark": "#121212",
                    },
                    fontFamily: {
                        "display": ["Spline Sans", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
<div class="relative flex h-auto min-h-screen w-full flex-col">
<div class="layout-container flex h-full grow flex-col">
<div class="flex flex-1 justify-center">
<div class="layout-content-container flex w-full flex-col">
<header class="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-background-dark/80 px-4 py-3 backdrop-blur-sm sm:px-8 md:px-16 lg:px-24">
<div class="flex items-center gap-8">
<div class="flex items-center gap-4 text-white">
<div class="size-6 text-primary">
<svg fill="none" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
</svg>
</div>
<h2 class="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Dizimey</h2>
</div>
<nav class="hidden items-center gap-9 md:flex">
<a class="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Ana Sayfa</a>
<a class="text-white text-sm font-medium leading-normal" href="#">Diziler</a>
<a class="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Filmler</a>
<a class="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Listem</a>
</nav>
</div>
<div class="flex flex-1 items-center justify-end gap-4">
<label class="hidden flex-col sm:flex !h-10 w-full max-w-64">
<div class="flex w-full flex-1 items-stretch rounded-lg h-full">
<div class="text-white/60 flex border-none bg-white/10 items-center justify-center pl-3 rounded-l-lg border-r-0">
<span class="material-symbols-outlined text-xl">search</span>
</div>
<input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-white/10 focus:border-none h-full placeholder:text-white/60 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Ara..." value=""/>
</div>
</label>
<button class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-white/10 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 transition-colors hover:bg-white/20">
<span class="material-symbols-outlined text-2xl">notifications</span>
</button>
<div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="User profile picture" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVrbzRMVaj5hLt0iGpZ0irYhNIrdaLmuFnw3THcRJUJ4JLppJW1_3z1yESct1JcluNhxR9O9TracO90JIbJguxYKYDqsOiIkZ05LH2fmAMSf4X6t0iNrQXGK-9nnG3P4PHY571_YH4YHCP-z76I6gVWAnZdtcoNOMlmMQLOsVmufyppREV5NAF0Z97OiMAxFFZ1TFl9FXHSKR413tYL2Uizsb-gIozLiTTgK6KOjK2wPiieU_f_nLFg_0xlyXT6aC8BYayK4v9ZT0");'></div>
</div>
</header>
<main class="flex flex-col">
<!-- Hero Section -->
<section class="relative w-full">
<div class="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-transparent"></div>
<div class="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/20 to-transparent"></div>
<div class="bg-cover bg-center flex flex-col justify-end w-full min-h-[60vh] lg:min-h-[80vh]" data-alt="A dramatic scene from the movie Inception" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCo8zyHxkzSfba6g-ItG6NUzsD_joIZSwYXR8KSZP9yjc1-kFGmutaVUpYt9yIOEe_kxnHxTC8Ioouex5rZKEEECJYOwVmIK0WyUTN6zYFpQQ_yqCV52nvcQGcQsvlqUpe-H9z3zhZjal1DVWAjg3Q7GwMRkNqg_tGaGPtz0yVxk6CePHW7zzt825dsYQMklpHvFPFr2jzFao_4yhqKJQvod5B1yuRY8b_2XMvMo6UDMIVV7gRfxb3SOdN8IqEuAoHaVdfN0uvmq7o");'>
<div class="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-8 md:px-16 lg:px-24">
<div class="max-w-xl">
<h1 class="text-white text-5xl font-bold leading-tight tracking-tighter md:text-7xl">Inception</h1>
<p class="text-white/80 text-base font-normal leading-normal mt-4">Zihin hırsızlığının teknolojiyle mümkün olduğu bir dünyada, yetenekli bir hırsıza imkansız bir görev verilir: bir fikri çalmak yerine bir başkasının zihnine fikir ekmek.</p>
<div class="text-white/60 text-sm font-normal leading-normal mt-4 flex items-center gap-x-4 gap-y-2 flex-wrap">
<span>Bilim Kurgu</span>
<span class="h-1 w-1 rounded-full bg-white/40"></span>
<span>2010</span>
<span class="h-1 w-1 rounded-full bg-white/40"></span>
<span class="border border-white/40 px-1 py-0.5 rounded text-xs">13+</span>
<span class="h-1 w-1 rounded-full bg-white/40"></span>
<span>2 sa 28 dk</span>
</div>
<div class="flex flex-1 gap-3 flex-wrap mt-6">
<button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] transition-transform hover:scale-105">
<span class="material-symbols-outlined">play_arrow</span>
<span class="truncate">Oynat</span>
</button>
<button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-5 bg-white/20 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-white/30">
<span class="material-symbols-outlined">add</span>
<span class="truncate">Listeme Ekle</span>
</button>
</div>
</div>
</div>
</div>
</section>
<!-- Content Section -->
<section class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 md:px-16 lg:px-24">
<!-- Tab Navigation -->
<div class="border-b border-white/10">
<nav aria-label="Tabs" class="flex space-x-8">
<a class="whitespace-nowrap border-b-2 border-primary px-1 py-4 text-sm font-medium text-white" href="#">Genel Bakış</a>
<a class="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-white/60 hover:border-white/30 hover:text-white/80" href="#">Oyuncular</a>
<a class="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-white/60 hover:border-white/30 hover:text-white/80" href="#">Benzer İçerikler</a>
</nav>
</div>
<!-- Tab Content -->
<div class="py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
<div class="lg:col-span-2">
<h3 class="text-2xl font-bold text-white mb-4">Konu Özeti</h3>
<p class="text-white/80 text-base leading-relaxed">Dom Cobb, insanların rüyalarına girerek onların en değerli sırlarını çalan yetenekli bir hırsızdır. Bu nadir yeteneği onu, kurumsal casusluğun tehlikeli yeni dünyasında aranan bir oyuncu yapmıştır, ancak aynı zamanda onu uluslararası bir kaçak haline getirmiş ve sevdiği her şeye mal olmuştur. Cobb'a kefaret için bir şans sunulur. Son bir iş ona hayatını geri verebilir, ancak imkansızı başarması gerekmektedir: başlangıç. Cobb ve uzman ekibi, bir fikri çalmak yerine bir fikir ekmek zorundadır. Eğer başarırlarsa, bu mükemmel bir suç olabilir.</p>
<div class="mt-10">
<h3 class="text-2xl font-bold text-white mb-4">Oyuncu Kadrosu</h3>
<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
<div class="flex flex-col items-center text-center">
<div class="w-24 h-24 rounded-full bg-cover bg-center mb-2" data-alt="Photo of Leonardo DiCaprio" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7Xt3ujsFVjFbMTKn6v0PCU8i8cBYi93HktZ4-M96adXFrFL2-aD_GPwaa-cwThiCTPQREo4IjIjRzBokrwtlgSfDoNs3RliUKvmYHM6SI_p6uC-v0HAMHbW8hqFOLM8KWayS47qyF3FkljKrBGdilMIwB3E2z24zMy_HKpNhkBodOIxPW3gmcUwKn7FxdZQI2PiS57ykFAe5S79c4vGRarXMjJ_8w7-IpUQkbM_KiswhbYwEimpUpWy9P-dGZkGZErD4QM7qtAh8');"></div>
<p class="text-sm font-medium text-white">Leonardo DiCaprio</p>
<p class="text-xs text-white/60">Cobb</p>
</div>
<div class="flex flex-col items-center text-center">
<div class="w-24 h-24 rounded-full bg-cover bg-center mb-2" data-alt="Photo of Joseph Gordon-Levitt" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0W74O1dn6HixE6F1zinKYrdvk9SeKkGfnRfpmV9-6H6coKJZrn0mgzChY3SnHdSUblZG9v9R-oQ-d-Oakvkx_UXVtiyzHzr5ies6T9azVWyXm_lnhp_ja68AjVmw7KFamRmEJrp13wjv2Et25bvVbxJp8Y_BY3IjCrXh3gMiGQnBSU_gyySJC3nEk-PbsIZLgO5EdIFarIpMsPHG5ribmoiHsFdDaOYF9qV77re5pcHjXh-7t8MBCtvNJNEzx2NIWmmPorp5zc5Q');"></div>
<p class="text-sm font-medium text-white">Joseph Gordon-Levitt</p>
<p class="text-xs text-white/60">Arthur</p>
</div>
<div class="flex flex-col items-center text-center">
<div class="w-24 h-24 rounded-full bg-cover bg-center mb-2" data-alt="Photo of Elliot Page" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZ9bgzo85vs9sAcXgAmz-gLBBZLOdfW-0Xv8TqfxoLVGIOelJeJKbydwsPkyuWdJESqd-GsWpiyZhKGjQDgNBxe8yCyCLRffyURQoRPf0Lhy9a_QfdTvzhfsxygCy55zr92woZ4UKQL4jjikXhxlhvnaAf1aeisyGEdC3rjVGA3xFgLNjUVlnmZMDPpT6su2jIOXdFAqJm-suaR7UX41aleVwsE0cTae09mgoJD86whmNOkxhUc8JQwjITA-LSRmfaxNYTTkTHa_k');"></div>
<p class="text-sm font-medium text-white">Elliot Page</p>
<p class="text-xs text-white/60">Ariadne</p>
</div>
<div class="flex flex-col items-center text-center">
<div class="w-24 h-24 rounded-full bg-cover bg-center mb-2" data-alt="Photo of Tom Hardy" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5kraZ9ri30FN4Qx25K2Dje50Wwbva0SbKzUA_iCo1KcTYPnICYl-L3kdv4ygD1-fyJIVLNZiSagTfKKGdeBsKMaKKcYtd3-OcCnXpLS6rA9AdTTd2QIAe5i8oWDlnDfnLClde9B3Dpujx9RBPpaXrA9aku7ZdJBVNpGfSEOBtzUXIniv7vYM_xt-u0_X23HH4fpcMq9yDTP1UQyXUA0Swa0jQjGcmP1K9g0Z611awSgb4Y6MVonIpf07XJd6a5D7IQJkay762Jo4');"></div>
<p class="text-sm font-medium text-white">Tom Hardy</p>
<p class="text-xs text-white/60">Eames</p>
</div>
</div>
</div>
</div>
<div class="space-y-4">
<div>
<h4 class="text-sm font-bold text-white/60 mb-1">Yönetmen</h4>
<p class="text-base text-white">Christopher Nolan</p>
</div>
<div>
<h4 class="text-sm font-bold text-white/60 mb-1">Senarist</h4>
<p class="text-base text-white">Christopher Nolan</p>
</div>
<div>
<h4 class="text-sm font-bold text-white/60 mb-1">Türler</h4>
<p class="text-base text-white">Bilim Kurgu, Aksiyon, Macera</p>
</div>
<div class="pt-4">
<h4 class="text-sm font-bold text-white/60 mb-2">Puanlamalar</h4>
<div class="flex items-center gap-4">
<div class="flex items-center gap-2">
<img alt="IMDb Logo" class="h-6 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYdA6_ny1WrOlWXF3c17R04gaJrSpnX3e_QXhu1LDxnsIKtXHiv2rrgEqjJngHPUrSWCLWgmWFpkOOk-o0pIwggUDb76pXzEBdT1CoCiXn-9HdiuTciqPM7D9LGpnBS_qWVgZyExhKuIw3aZO_e5bSsX-hBJDz_0BBcOznhR59ANWMPnUNnPo5drj9OV6LqV_bTzLjErnI6AILlvwCJ-_PCDBXrZgf30PJaHM1qufR_4zlQqyTdynAXfRGQox92Hm8-IqQnSie0EM"/>
<span class="text-lg font-bold text-white">8.8/10</span>
</div>
</div>
</div>
</div>
</div>
<!-- Recommendation Grid -->
<div class="py-10">
<h3 class="text-2xl font-bold text-white mb-4">Benzer İçerikler</h3>
<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
<div class="aspect-[2/3] bg-white/10 rounded-lg bg-cover bg-center transition-transform hover:scale-105" data-alt="Poster for The Matrix" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDDikaPBQdaT-_ONfPx5bTI3H82VYLR3NKrriLd4hSJH74hSXLc8IuxT43PLt9XAGqIBHxiinsk9PMbwmbDiZ-3osIo4wBwfXJDBNDVGBef_ON0kGStbcucBHr4l2N8F4q-pBJKrv_StmxkbI4Z9-8-0TZ2mMt7OmTzD0apQ8Xb83eNq4mQtSWrPE1iTo5RBYIhI4Dg_pGxCWoBLfBs1gCct_ieHamI8V8CK6_RWRh_ZmROczADstDb6zd6p0vxL6v6RlMlTWiBmJQ');"></div>
<div class="aspect-[2/3] bg-white/10 rounded-lg bg-cover bg-center transition-transform hover:scale-105" data-alt="Poster for Interstellar" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDCCilQnwXwGFmxrEmMGdoYkE6-U-hNA2wec5NmwKqKQ71jv0gd7w5XAIr2x_q7lGGfzSOPawlUzjS6qhf0RYp9tixc8_SmzzGAC2fpuOKRRopt1WFErqrE5Z_2xHlvqT8UkGfeOyEKbFmIPfjgkvBMccEZYhMuroGEYLT-YbkGpqPRcSDx2xlIppDm7G_5bEro_JzPHf4eFIlSmbL8T0jckgHYgDtr2jiOSpez2TzBnmCwSHNaN8N9e3xK6Hnw09nbHkn0Vn_rZpo');"></div>
<div class="aspect-[2/3] bg-white/10 rounded-lg bg-cover bg-center transition-transform hover:scale-105" data-alt="Poster for Blade Runner 2049" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDq68CNR7e1Y4CkHzL7yaV2ygNYtc8p6wHNrCJhwkaaRcaeUwBitdHK96fexL8RNCiOiM8nf3VHqTQi0Ze_EG_2w4DXko4gMK9P6OsCTqe9Fd6qhXfC1j64KckR790m69dkjxQhWcFQQ9qHXBuhFq1S4zTS837Et2kp1GenbgxKoF5oGICTHq8nfjeJ1D1IqvieBUIqomXUuxRRmzwJyswrALy8xSpkmRVpJeKO0whLDMIUA4VPynnjcOG4z_EGf-UZXyOEa1O8Y_s');"></div>
<div class="aspect-[2/3] bg-white/10 rounded-lg bg-cover bg-center transition-transform hover:scale-105" data-alt="Poster for Shutter Island" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAd9PAEACWh7TaSTuUrhi8uhEDXaZW86aJc1txcH0c3TD9vM2LSe8vfBBOCf0Q1IAx1qppAWDH5XOLzOSnsIV9Pj69fd5mi-s4ixan_SuSKj8MS8Sdo4NMKIDU3wVGikgCxaTuFDV3tU3mXHACfDCwqkePYr6SuZLll_xF34Dixarnar_7qcflAobI8Uv97iPLUBHCF-vk4ExxCqRVUEhxEAIXI4wwKTXRimixDxOENa3XBE8RQxDq1XNvp0SYFKE3r4tJaWwRnvNM');"></div>
<div class="aspect-[2/3] bg-white/10 rounded-lg bg-cover bg-center transition-transform hover:scale-105" data-alt="Poster for The Prestige" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDf_MxpgA9aLvxYaYT2m-1tqWHJaIc5GgVDBQvpvC46h-Lfc2EE0kH6tF3GAV0p4jyg9EnUREU0JGYsGD2uU_p301pYpKPy9uxyfmQaViqrcCyBV2TDb15bTLCO7eH4cfN2O7x3C8lRXJ7Qjcol6sE__ue3chRJ42xOH0TL605BIA3IO8v03snBkGwcS67ftfFc-XPfyIjz7-J1_7vuBRDi5BCQ28IAR9R1m4X6BLSeX6b_IiOetHZx8c4zGEpDQCeSUVuPOFP0d_Y');"></div>
<div class="aspect-[2/3] bg-white/10 rounded-lg bg-cover bg-center transition-transform hover:scale-105" data-alt="Poster for Arrival" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsRuAQshzqQ7A9t6ijl1vadTJcWjdWDTKqYJumLO6a1J4J3LSRraoSzrQiGfWkGVPU3_H0DaLcfIBDl90pOLHoBFy5_uX_f5MLZeqXM2mv4sqv977iHT7a-FK35brj8wYzzXBOIH8TT2GwVyiMOU3sXS16MqRvDk3k9T5XAwE61Cj-ObPMMCODk5enZVybQTPi5ODzvthGQkLQBLslnBpJNfRPS764vx8OxahQhkL7XymEl7ygf9LM5AbaP3vjEhtB8Xb-ZzfClIA');"></div>
</div>
</div>
</section>
</main>
</div>
</div>
</div>
</div>
</body></html>