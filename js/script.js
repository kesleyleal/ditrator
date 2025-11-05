        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        // Carousel Script
        const carouselItems = document.querySelectorAll('.carousel-item');
        const indicators = document.querySelectorAll('#indicators .indicator');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        let currentIndex = 0;
        let intervalId;
        function updateCarousel() {
            carouselItems.forEach((item, index) => {
                item.classList.toggle('active', index === currentIndex);
            });
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active-indicator', index === currentIndex);
                indicator.classList.toggle('opacity-100', index === currentIndex);
                indicator.classList.toggle('opacity-50', index !== currentIndex);
            });
        }
        function showNext() {
            currentIndex = (currentIndex + 1) % carouselItems.length;
            updateCarousel();
        }
        function showPrev() {
            currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
            updateCarousel();
        }
        function startAutoplay() {
            intervalId = setInterval(showNext, 5000); // Change slide every 5 seconds
        }
        function stopAutoplay() {
            clearInterval(intervalId);
        }
        nextBtn.addEventListener('click', () => {
            showNext();
            stopAutoplay();
            startAutoplay();
        });
        prevBtn.addEventListener('click', () => {
            showPrev();
            stopAutoplay();
            startAutoplay();
        });
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                stopAutoplay();
                startAutoplay();
            });
        });

        updateCarousel();
        startAutoplay();

        document.addEventListener('DOMContentLoaded', () => {
            const links = document.querySelectorAll('a[href]');

            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    return;
                }
                const isInternal = (link.hostname === window.location.hostname || link.hostname === '');

                if (isInternal) {
                    link.addEventListener('click', (event) => {
                        event.preventDefault();
                        document.body.classList.add('page-exit');
                        setTimeout(() => {
                            window.location.href = href;
                        }, 300);
                    });
                }
            });
        });
 /**
 * Lógica para a busca de representantes por Estado + Município.
 * Usa Select2 para um dropdown de municípios pesquisável.
 *
 * CORREÇÃO: Lista TODOS os municípios de um estado,
 * independentemente de terem um representante ("EM BRANCO") ou não.
 * ATUALIZAÇÃO: Adiciona classes de TEMA ESCURO na caixa de resultados.
 */

// --- 1. BASE DE DADOS (Representantes, Mapeamento de Municípios, Lista Completa) ---

/**
 * Mapeamento dos representantes (IDs e Detalhes).
 */
const REPRESENTANTES_MAP = {
    // --- Representantes do Paraná (Novos) ---
    'rep_pr_sergio': {
        nome: 'Sergio Siemieniaco (PR)',
        telefone: '(42) 9921-4872',
        email: 'sergiosiemieniaco@hotmail.com',
    },
    'rep_pr_ricardo': {
        nome: 'Ricardo Veronese (PR)',
        telefone: '(45) 9979-9301',
        email: 'ricardo.veronese@gmail.com',
    },
    'rep_pr_jefferson': {
        nome: 'Jefferson Scussiatto (PR)',
        telefone: '(49) 9902-6000',
        email: 'tidyvendas@gmail.com',
    },
    'rep_pr_tiago': {
        nome: 'Tiago Costella (PR)',
        telefone: '(49) 9821-1224',
        email: 'tidyvendas@gmail.com',
    },

    // --- Representantes de Outros Estados (Mantidos para Sul) ---
    'rep_sc_ana': {
        nome: 'Ana (SC)',
        telefone: '(48) 99999-0005',
        email: 'ana.rep@email.com',
    },
    'rep_rs_carlos': {
        nome: 'Carlos (RS - Capital)',
        telefone: '(51) 99999-0006',
        email: 'carlos.rep@email.com',
    },
    'rep_rs_bia': {
        nome: 'Bia (RS - Interior)',
        telefone: '(54) 99999-0007',
        email: 'bia.rep@email.com',
    }
};

/**
 * Mapeamento APENAS dos Municípios QUE TÊM REPRESENTANTE.
 * Usado para a lógica de busca.
 */
const MUNICIPIOS_MAP = {
    // --- PARANÁ (PR) ---
    'abatiá (pr)': 'rep_pr_sergio',
    'altamira do paraná (pr)': 'rep_pr_ricardo',
    'altônia (pr)': 'rep_pr_ricardo',
    'alvorada do sul (pr)': 'rep_pr_sergio',
    'ampere (pr)': 'rep_pr_jefferson',
    'anahy (pr)': 'rep_pr_ricardo',
    'andira (pr)': 'rep_pr_sergio',
    'apucarana (pr)': 'rep_pr_sergio',
    'arapongas (pr)': 'rep_pr_sergio',
    'arapoti (pr)': 'rep_pr_sergio',
    'arapuã (pr)': 'rep_pr_sergio',
    'ariranha do ivaí (pr)': 'rep_pr_sergio',
    'assaí (pr)': 'rep_pr_sergio',
    'assis chateaubriand (pr)': 'rep_pr_ricardo',
    'bandeirantes (pr)': 'rep_pr_sergio',
    'barra do jacare (pr)': 'rep_pr_sergio',
    'barracão (pr)': 'rep_pr_jefferson',
    'bela vista da caroba (pr)': 'rep_pr_jefferson',
    'bela vista do paraíso (pr)': 'rep_pr_sergio',
    'bituruna (pr)': 'rep_pr_tiago',
    'boa esperança do iguaçú (pr)': 'rep_pr_jefferson',
    'boa ventura do são roque (pr)': 'rep_pr_sergio',
    'boa vista da aparecida (pr)': 'rep_pr_ricardo',
    'bom jesus do sul (pr)': 'rep_pr_jefferson',
    'bom sucesso do sul (pr)': 'rep_pr_jefferson',
    'borrazópolis (pr)': 'rep_pr_sergio',
    'braganey (pr)': 'rep_pr_ricardo',
    'cafelandia (pr)': 'rep_pr_ricardo',
    'califórnia (pr)': 'rep_pr_sergio',
    'cambará (pr)': 'rep_pr_sergio',
    'cambé (pr)': 'rep_pr_sergio',
    'campina da lagoa (pr)': 'rep_pr_ricardo',
    'campina do simao (pr)': 'rep_pr_sergio',
    'campo bonito (pr)': 'rep_pr_ricardo',
    'campo mourão (pr)': 'rep_pr_ricardo',
    'cândido de abreu (pr)': 'rep_pr_sergio',
    'candoi (pr)': 'rep_pr_sergio',
    'cantagalo (pr)': 'rep_pr_sergio',
    'capanema (pr)': 'rep_pr_jefferson',
    'capitão leônidas marques (pr)': 'rep_pr_ricardo',
    'carambeí (pr)': 'rep_pr_sergio',
    'carlópolis (pr)': 'rep_pr_sergio',
    'cascavel (pr)': 'rep_pr_ricardo',
    'castro (pr)': 'rep_pr_sergio',
    'catanduvas (pr)': 'rep_pr_ricardo',
    'céu azul (pr)': 'rep_pr_ricardo',
    'chopinzinho (pr)': 'rep_pr_jefferson',
    'clevelândia (pr)': 'rep_pr_jefferson',
    'congonhinhas (pr)': 'rep_pr_sergio',
    'conselheiro mairinck (pr)': 'rep_pr_sergio',
    'corbélia (pr)': 'rep_pr_ricardo',
    'cornélio procopio (pr)': 'rep_pr_sergio',
    'coronel domingos soares (pr)': 'rep_pr_jefferson',
    'coronel vivida (pr)': 'rep_pr_jefferson',
    'cruz machado (pr)': 'rep_pr_tiago',
    'cruzeiro do iguaçú (pr)': 'rep_pr_jefferson',
    'cruzmaltina (pr)': 'rep_pr_sergio',
    'curiúva (pr)': 'rep_pr_sergio',
    'diamante do oeste (pr)': 'rep_pr_ricardo',
    'diamante do sul (pr)': 'rep_pr_ricardo',
    'dois vizinhos (pr)': 'rep_pr_jefferson',
    'éneas marques (pr)': 'rep_pr_jefferson',
    'entre rios do oeste (pr)': 'rep_pr_ricardo',
    'espigão alto do iguaçu (pr)': 'rep_pr_ricardo',
    'faxinal (pr)': 'rep_pr_sergio',
    'fernandes pinheiro (pr)': 'rep_pr_sergio',
    'figueira (pr)': 'rep_pr_sergio',
    'flor da serra do sul (pr)': 'rep_pr_jefferson',
    'foz do iguaçu (pr)': 'rep_pr_ricardo',
    'foz do jordão (pr)': 'rep_pr_sergio',
    'francisco beltrão (pr)': 'rep_pr_jefferson',
    'general carneiro (pr)': 'rep_pr_tiago',
    'goioxím (pr)': 'rep_pr_sergio',
    'grandes rios (pr)': 'rep_pr_sergio',
    'guaíra (pr)': 'rep_pr_ricardo',
    'guamiranga (pr)': 'rep_pr_sergio',
    'guapirama (pr)': 'rep_pr_sergio',
    'guaraniaçu (pr)': 'rep_pr_ricardo',
    'guarapuava (pr)': 'rep_pr_sergio',
    'honório serpa (pr)': 'rep_pr_jefferson',
    'ibaiti (pr)': 'rep_pr_sergio',
    'ibema (pr)': 'rep_pr_ricardo',
    'ibiporã (pr)': 'rep_pr_sergio',
    'iguatu (pr)': 'rep_pr_ricardo',
    'imbaú (pr)': 'rep_pr_sergio',
    'imbituva (pr)': 'rep_pr_sergio',
    'inácio martins (pr)': 'rep_pr_sergio',
    'ipiranga (pr)': 'rep_pr_sergio',
    'iracema do oeste (pr)': 'rep_pr_ricardo',
    'irati (pr)': 'rep_pr_sergio',
    'itaipulândia (pr)': 'rep_pr_ricardo',
    'itambaracá (pr)': 'rep_pr_sergio',
    'itapejara do oeste (pr)': 'rep_pr_jefferson',
    'ivaí (pr)': 'rep_pr_sergio',
    'ivaiporã (pr)': 'rep_pr_sergio',
    'jaboti (pr)': 'rep_pr_sergio',
    'jacarezinho (pr)': 'rep_pr_sergio',
    'jaguariaíva (pr)': 'rep_pr_sergio',
    'japira (pr)': 'rep_pr_sergio',
    'japurá (pr)': 'rep_pr_ricardo',
    'jardim alegre (pr)': 'rep_pr_sergio',
    'jataizinho (pr)': 'rep_pr_sergio',
    'joaquim távora (pr)': 'rep_pr_sergio',
    'jundiaí do sul (pr)': 'rep_pr_sergio',
    'laranjal (pr)': 'rep_pr_ricardo',
    'laranjeiras do sul (pr)': 'rep_pr_sergio',
    'leópolis (pr)': 'rep_pr_sergio',
    'lidianópolis (pr)': 'rep_pr_sergio',
    'lindoeste (pr)': 'rep_pr_ricardo',
    'londrina (pr)': 'rep_pr_sergio',
    'mallet (pr)': 'rep_pr_sergio',
    'manfrinópolis (pr)': 'rep_pr_jefferson',
    'mangueirinha (pr)': 'rep_pr_jefferson',
    'manoel ribas (pr)': 'rep_pr_sergio',
    'marechal candido rondon (pr)': 'rep_pr_ricardo',
    'marilândia do sul (pr)': 'rep_pr_sergio',
    'mariluz (pr)': 'rep_pr_ricardo',
    'mariópolis (pr)': 'rep_pr_jefferson',
    'maripá (pr)': 'rep_pr_ricardo',
    'marmeleiro (pr)': 'rep_pr_jefferson',
    'marquinho (pr)': 'rep_pr_sergio',
    'matelândia (pr)': 'rep_pr_ricardo',
    'mauá da serra (pr)': 'rep_pr_sergio',
    'medianeira (pr)': 'rep_pr_ricardo',
    'mercedes (pr)': 'rep_pr_ricardo',
    'missal (pr)': 'rep_pr_ricardo',
    'moreira sales (pr)': 'rep_pr_ricardo',
    'nova américa da colina (pr)': 'rep_pr_sergio',
    'nova aurora (pr)': 'rep_pr_ricardo',
    'nova cantu (pr)': 'rep_pr_ricardo',
    'nova esperança do sudoeste (pr)': 'rep_pr_jefferson',
    'nova fátima (pr)': 'rep_pr_sergio',
    'nova laranjeiras (pr)': 'rep_pr_ricardo',
    'nova prata do iguaçú (pr)': 'rep_pr_jefferson',
    'nova santa bárbara (pr)': 'rep_pr_sergio',
    'nova santa rosa (pr)': 'rep_pr_ricardo',
    'ortigueira (pr)': 'rep_pr_sergio',
    'ouro verde do oeste (pr)': 'rep_pr_ricardo',
    'palmas (pr)': 'rep_pr_jefferson',
    'palmeira (pr)': 'rep_pr_sergio',
    'palmital (pr)': 'rep_pr_ricardo',
    'palotina (pr)': 'rep_pr_ricardo',
    'pato bragado (pr)': 'rep_pr_ricardo',
    'pato branco (pr)': 'rep_pr_jefferson',
    'paula freitas (pr)': 'rep_pr_tiago',
    'paulo frontin (pr)': 'rep_pr_tiago',
    'pérola do oeste (pr)': 'rep_pr_jefferson',
    'pinhalão (pr)': 'rep_pr_sergio',
    'pinhão (pr)': 'rep_pr_sergio',
    'pinhao de são bento (pr)': 'rep_pr_jefferson',
    'piraí do sul (pr)': 'rep_pr_sergio',
    'pitanga (pr)': 'rep_pr_sergio',
    'planaltina (pr)': 'rep_pr_jefferson',
    'ponta grossa (pr)': 'rep_pr_sergio',
    'porto barreiro (pr)': 'rep_pr_sergio',
    'porto vitória (pr)': 'rep_pr_tiago',
    'pranchita (pr)': 'rep_pr_jefferson',
    'primeiro de maio (pr)': 'rep_pr_sergio',
    'prudentópolis (pr)': 'rep_pr_sergio',
    'quatingá (pr)': 'rep_pr_sergio',
    'quatro pontes (pr)': 'rep_pr_ricardo',
    'quedas do iguaçu (pr)': 'rep_pr_ricardo',
    'ramilândia (pr)': 'rep_pr_ricardo',
    'rancho alegre (pr)': 'rep_pr_sergio',
    'realeza (pr)': 'rep_pr_jefferson',
    'rebouças (pr)': 'rep_pr_sergio',
    'renascença (pr)': 'rep_pr_jefferson',
    'reserva (pr)': 'rep_pr_sergio',
    'reserva do iguaçu (pr)': 'rep_pr_jefferson',
    'ribeirão claro (pr)': 'rep_pr_sergio',
    'ribeirão do pinhal (pr)': 'rep_pr_sergio',
    'rio azul (pr)': 'rep_pr_sergio',
    'rio bom (pr)': 'rep_pr_sergio',
    'rio bonito do iguaçu (pr)': 'rep_pr_sergio',
    'rio branco do ivaí (pr)': 'rep_pr_sergio',
    'rolândia (pr)': 'rep_pr_sergio',
    'rosário do ivaí (pr)': 'rep_pr_sergio',
    'salgado filho (pr)': 'rep_pr_jefferson',
    'salto do itararé (pr)': 'rep_pr_sergio',
    'salto do lontra (pr)': 'rep_pr_jefferson',
    'santa amelia (pr)': 'rep_pr_sergio',
    'santa cecília do pavão (pr)': 'rep_pr_sergio',
    'santa helena (pr)': 'rep_pr_ricardo',
    'santa izabel do oeste (pr)': 'rep_pr_jefferson',
    'santa lucia (pr)': 'rep_pr_ricardo',
    'santa maria do oeste (pr)': 'rep_pr_sergio',
    'santa mariana (pr)': 'rep_pr_sergio',
    'santa tereza do oeste (pr)': 'rep_pr_ricardo',
    'santa terezinha de itaipu (pr)': 'rep_pr_ricardo',
    'santana do itararé (pr)': 'rep_pr_sergio',
    'santo antonio da platina (pr)': 'rep_pr_sergio',
    'santo antonio do paraíso (pr)': 'rep_pr_sergio',
    'santo antônio do sudoeste (pr)': 'rep_pr_jefferson',
    'são jerônimo da serra (pr)': 'rep_pr_sergio',
    'são joão do triunfo (pr)': 'rep_pr_sergio',
    'são jorge do oeste (pr)': 'rep_pr_jefferson',
    'são josé da boa vista (pr)': 'rep_pr_sergio',
    'sao jose das palmeiras (pr)': 'rep_pr_ricardo',
    'são mateus do sul (pr)': 'rep_pr_sergio',
    'são miguel do iguaçu (pr)': 'rep_pr_ricardo',
    'são pedro do iguaçu (pr)': 'rep_pr_ricardo',
    'são sebastião da amoreira (pr)': 'rep_pr_sergio',
    'sapopema (pr)': 'rep_pr_sergio',
    'saudades do iguaçu (pr)': 'rep_pr_jefferson',
    'sengés (pr)': 'rep_pr_sergio',
    'serranópolis do iguaçu (pr)': 'rep_pr_ricardo',
    'sertaneja (pr)': 'rep_pr_sergio',
    'sertanópolis (pr)': 'rep_pr_sergio',
    'siqueira campos (pr)': 'rep_pr_sergio',
    'sulinas (pr)': 'rep_pr_jefferson',
    'tamarana (pr)': 'rep_pr_sergio',
    'teixeira soares (pr)': 'rep_pr_sergio',
    'telêmaco borba (pr)': 'rep_pr_sergio',
    'terra roxa (pr)': 'rep_pr_ricardo',
    'tibagi (pr)': 'rep_pr_sergio',
    'toledo (pr)': 'rep_pr_ricardo',
    'tomazina (pr)': 'rep_pr_sergio',
    'três barras do paraná (pr)': 'rep_pr_ricardo',
    'tupassi (pr)': 'rep_pr_ricardo',
    'turvo (pr)': 'rep_pr_sergio',
    'ubiratã (pr)': 'rep_pr_ricardo',
    'umuarama (pr)': 'rep_pr_ricardo',
    'união da vitória (pr)': 'rep_pr_tiago',
    'uraí (pr)': 'rep_pr_sergio',
    'ventania (pr)': 'rep_pr_sergio',
    'veracruz do oeste (pr)': 'rep_pr_ricardo',
    'verê (pr)': 'rep_pr_jefferson',
    'virmond (pr)': 'rep_pr_sergio',
    'vitorino (pr)': 'rep_pr_jefferson',
    'wenceslau bráz (pr)': 'rep_pr_sergio',
    
    // --- Santa Catarina (SC) ---
    'florianópolis (sc)': 'rep_sc_ana',
    'joinville (sc)': 'rep_sc_ana',
    'blumenau (sc)': 'rep_sc_ana',

    // --- Rio Grande do Sul (RS) ---
    'porto alegre (rs)': 'rep_rs_carlos',
    'canoas (rs)': 'rep_rs_carlos',
    'caxias do sul (rs)': 'rep_rs_bia',
    'passo fundo (rs)': 'rep_rs_bia',
};

/**
 * NOVO: Lista COMPLETA de municípios por estado.
 * Usada para popular o Select2.
 */
const ALL_MUNICIPIOS_BY_STATE = {
    'PR': [
        'Abatiá (PR)',
        'Adrianópolis (PR)',
        'Agudos do Sul (PR)',
        'Almirante Tamandaré (PR)',
        'Altamira do Paraná (PR)',
        'Altania (PR)',
        'Alto Paraná (PR)',
        'Alto Piquiri (PR)',
        'Altônia (PR)',
        'Alvorada do Sul (PR)',
        'Amaporã (PR)',
        'Ampere (PR)',
        'Anahy (PR)',
        'Andirá (PR)',
        'Angulo (PR)',
        'Antonina (PR)',
        'Antônio Olinto (PR)',
        'Apucarana (PR)',
        'Arapongas (PR)',
        'Arapoti (PR)',
        'Arapuã (PR)',
        'Araruna (PR)',
        'Araucária (PR)',
        'Ariranha do Ivaí (PR)',
        'Assaí (PR)',
        'Assis Chateaubriand (PR)',
        'Astorga (PR)',
        'Atalaia (PR)',
        'Balsa Nova (PR)',
        'Bandeirantes (PR)',
        'Barbosa Ferraz (PR)',
        'Barra do Jacaré (PR)',
        'Barracão (PR)',
        'Bela Vista da Caroba (PR)',
        'Bela Vista do Paraíso (PR)',
        'Bituruna (PR)',
        'Boa Esperança (PR)',
        'Boa Esperança do Iguaçú (PR)',
        'Boa Ventura do São Roque (PR)',
        'Boa Vista da Aparecida (PR)',
        'Bocaiúva do Sul (PR)',
        'Bom Jesus do Sul (PR)',
        'Bom Sucesso do Sul (PR)',
        'Borrazópolis (PR)',
        'Braganey (PR)',
        'Brasilândia do Sul (PR)',
        'Cafeára (PR)',
        'Cafelândia (PR)',
        'Cafezal do Sul (PR)',
        'Califórnia (PR)',
        'Cambará (PR)',
        'Cambé (PR)',
        'Cambira (PR)',
        'Campina da Lagoa (PR)',
        'Campina do Simão (PR)',
        'Campina Grande do Sul (PR)',
        'Campo Bonito (PR)',
        'Campo do Tenente (PR)',
        'Campo Largo (PR)',
        'Campo Magro (PR)',
        'Campo Mourão (PR)',
        'Cândido de Abreu (PR)',
        'Candói (PR)',
        'Cantagalo (PR)',
        'Capanema (PR)',
        'Capitão Leônidas Marques (PR)',
        'Carambeí (PR)',
        'Carlópolis (PR)',
        'Cascavel (PR)',
        'Castro (PR)',
        'Catanduvas (PR)',
        'Centenário do Sul (PR)',
        'Cerro Azul (PR)',
        'Céu Azul (PR)',
        'Chopinzinho (PR)',
        'Cianorte (PR)',
        'Cidade Gaúcha (PR)',
        'Clevelândia (PR)',
        'Colombo (PR)',
        'Colorado (PR)',
        'Congonhinhas (PR)',
        'Conselheiro Mairinck (PR)',
        'Contenda (PR)',
        'Corbélia (PR)',
        'Cornélio Procópio (PR)',
        'Coronel Domingos Soares (PR)',
        'Coronel Vivida (PR)',
        'Corumbataí do Sul (PR)',
        'Cruz Machado (PR)',
        'Cruzeiro do Iguaçú (PR)',
        'Cruzeiro do Oeste (PR)',
        'Cruzeiro do Sul (PR)',
        'Cruzmaltina (PR)',
        'Curitiba (PR)',
        'Curiúva (PR)',
        'Diamante do Norte (PR)',
        'Diamante do Oeste (PR)',
        'Diamante do Sul (PR)',
        'Dois Vizinhos (PR)',
        'Douradina (PR)',
        'Doutor Camargo (PR)',
        'Doutor Ulysses (PR)',
        'Éneas Marques (PR)',
        'Engenheiro Beltrão (PR)',
        'Entre Rios do Oeste (PR)',
        'Esperança Nova (PR)',
        'Espigão Alto do Iguaçu (PR)',
        'Farol (PR)',
        'Faxinal (PR)',
        'Fazenda Rio Grande (PR)',
        'Fênix (PR)',
        'Fernandes Pinheiro (PR)',
        'Figueira (PR)',
        'Flor da Serra do Sul (PR)',
        'Floraí (PR)',
        'Floresta (PR)',
        'Florestópolis (PR)',
        'Flórida (PR)',
        'Formosa do Oeste (PR)',
        'Foz do Iguaçu (PR)',
        'Foz do Jordão (PR)',
        'Francisco Alves (PR)',
        'Francisco Beltrão (PR)',
        'General Carneiro (PR)',
        'Godoy Moreira (PR)',
        'Goioerê (PR)',
        'Goioxim (PR)',
        'Grandes Rios (PR)',
        'Guaíra (PR)',
        'Guairaçá (PR)',
        'Guamiranga (PR)',
        'Guapirama (PR)',
        'Guaporema (PR)',
        'Guaraci (PR)',
        'Guaraniaçu (PR)',
        'Guarapuava (PR)',
        'Guaraqueçaba (PR)',
        'Guaratuba (PR)',
        'Honório Serpa (PR)',
        'Ibaiti (PR)',
        'Ibema (PR)',
        'Ibiporã (PR)',
        'Icaraíma (PR)',
        'Iguaraçu (PR)',
        'Iguatu (PR)',
        'Imbaú (PR)',
        'Imbituva (PR)',
        'Inácio Martins (PR)',
        'Inajá (PR)',
        'Indianópolis (PR)',
        'Ipiranga (PR)',
        'Iporã (PR)',
        'Iracema do Oeste (PR)',
        'Irati (PR)',
        'Iretama (PR)',
        'Itaguajé (PR)',
        'Itaipulândia (PR)',
        'Itambaracá (PR)',
        'Itambé (PR)',
        'Itapejara do Oeste (PR)',
        'Itaperuçu (PR)',
        'Itaúna do Sul (PR)',
        'Ivaí (PR)',
        'Ivaiporã (PR)',
        'Ivaté (PR)',
        'Ivatuba (PR)',
        'Jaboti (PR)',
        'Jacarezinho (PR)',
        'Jaguapitã (PR)',
        'Jaguariaíva (PR)',
        'Jandaia do Sul (PR)',
        'Janiópolis (PR)',
        'Japira (PR)',
        'Japurá (PR)',
        'Jardim Alegre (PR)',
        'Jardim Olinda (PR)',
        'Jataizinho (PR)',
        'Jesuítas (PR)',
        'Joaquim Távora (PR)',
        'Jundiaí do Sul (PR)',
        'Juranda (PR)',
        'Jussara (PR)',
        'Kaloré (PR)',
        'Lapa (PR)',
        'Laranjal (PR)',
        'Laranjeiras do Sul (PR)',
        'Leópolis (PR)',
        'Lidianópolis (PR)',
        'Lindoeste (PR)',
        'Loanda (PR)',
        'Lobato (PR)',
        'Londrina (PR)',
        'Luiziana (PR)',
        'Lunardelli (PR)',
        'Lupionópolis (PR)',
        'Mallet (PR)',
        'Mamborê (PR)',
        'Mandaguaçu (PR)',
        'Mandaguari (PR)',
        'Mandirituba (PR)',
        'Manfrinópolis (PR)',
        'Mangueirinha (PR)',
        'Manoel Ribas (PR)',
        'Marechal Cândido Rondon (PR)',
        'Maria Helena (PR)',
        'Marialva (PR)',
        'Marilândia do Sul (PR)',
        'Marilena (PR)',
        'Mariluz (PR)',
        'Maringá (PR)',
        'Mariópolis (PR)',
        'Maripá (PR)',
        'Marmeleiro (PR)',
        'Marquinho (PR)',
        'Marumbi (PR)',
        'Matelândia (PR)',
        'Matinhos (PR)',
        'Mato Rico (PR)',
        'Mauá da Serra (PR)',
        'Medianeira (PR)',
        'Mercedes (PR)',
        'Mirador (PR)',
        'Miraselva (PR)',
        'Missal (PR)',
        'Moreira Sales (PR)',
        'Morretes (PR)',
        'Munhoz de Melo (PR)',
        'Nossa Senhora das Graças (PR)',
        'Nova Aliança do Ivaí (PR)',
        'Nova América da Colina (PR)',
        'Nova Aurora (PR)',
        'Nova Cantu (PR)',
        'Nova Esperança (PR)',
        'Nova Esperança do Sudoeste (PR)',
        'Nova Fátima (PR)',
        'Nova Laranjeiras (PR)',
        'Nova Londrina (PR)',
        'Nova Olímpia (PR)',
        'Nova Prata do Iguaçú (PR)',
        'Nova Santa Bárbara (PR)',
        'Nova Santa Rosa (PR)',
        'Nova Tebas (PR)',
        'Novo Itacolomi (PR)',
        'Ortigueira (PR)',
        'Ourizona (PR)',
        'Ouro Verde do Oeste (PR)',
        'Paiçandu (PR)',
        'Palmas (PR)',
        'Palmeira (PR)',
        'Palmital (PR)',
        'Palotina (PR)',
        'Paraíso do Norte (PR)',
        'Paranacity (PR)',
        'Paranaguá (PR)',
        'Paranapoema (PR)',
        'Paranavaí (PR)',
        'Pato Bragado (PR)',
        'Pato Branco (PR)',
        'Paula Freitas (PR)',
        'Paulo Frontin (PR)',
        'Peabiru (PR)',
        'Perobal (PR)',
        'Pérola (PR)',
        'Pérola do Oeste (PR)',
        'Piên (PR)',
        'Pinhais (PR)',
        'Pinhal de São Bento (PR)',
        'Pinhalão (PR)',
        'Pinhão (PR)',
        'Pinhao de São Bento (PR)',
        'Piraí do Sul (PR)',
        'Piraquara (PR)',
        'Pitanga (PR)',
        'Pitangueiras (PR)',
        'Planaltina do Paraná (PR)',
        'Planalto (PR)',
        'Ponta Grossa (PR)',
        'Pontal do Paraná (PR)',
        'Porecatu (PR)',
        'Porto Amazonas (PR)',
        'Porto Barreiro (PR)',
        'Porto Rico (PR)',
        'Porto Vitória (PR)',
        'Prado Ferreira (PR)',
        'Pranchita (PR)',
        'Presidente Castelo Branco (PR)',
        'Primeiro de Maio (PR)',
        'Prudentópolis (PR)',
        'Quarto Centenário (PR)',
        'Quatingá (PR)',
        'Quatro Barras (PR)',
        'Quatro Pontes (PR)',
        'Quedas do Iguaçu (PR)',
        'Querência do Norte (PR)',
        'Quinta do Sol (PR)',
        'Quitandinha (PR)',
        'Ramilândia (PR)',
        'Rancho Alegre (PR)',
        'Rancho Alegre D\'Oeste (PR)',
        'Realeza (PR)',
        'Rebouças (PR)',
        'Renascença (PR)',
        'Reserva (PR)',
        'Reserva do Iguaçu (PR)',
        'Ribeirão Claro (PR)',
        'Ribeirão do Pinhal (PR)',
        'Rio Azul (PR)',
        'Rio Bom (PR)',
        'Rio Bonito do Iguaçu (PR)',
        'Rio Branco do Ivaí (PR)',
        'Rio Branco do Sul (PR)',
        'Rio Negro (PR)',
        'Rolândia (PR)',
        'Roncador (PR)',
        'Rondon (PR)',
        'Rosário do Ivaí (PR)',
        'Sabáudia (PR)',
        'Salgado Filho (PR)',
        'Salto do Itararé (PR)',
        'Salto do Lontra (PR)',
        'Santa Amélia (PR)',
        'Santa Cecília do Pavão (PR)',
        'Santa Cruz de Monte Castelo (PR)',
        'Santa Fé (PR)',
        'Santa Helena (PR)',
        'Santa Inês (PR)',
        'Santa Isabel do Ivaí (PR)',
        'Santa Izabel do Oeste (PR)',
        'Santa Lúcia (PR)',
        'Santa Maria do Oeste (PR)',
        'Santa Mariana (PR)',
        'Santa Mônica (PR)',
        'Santa Tereza do Oeste (PR)',
        'Santa Terezinha de Itaipu (PR)',
        'Santana do Itararé (PR)',
        'Santo Antônio da Platina (PR)',
        'Santo Antônio do Caiuá (PR)',
        'Santo Antônio do Paraíso (PR)',
        'Santo Antônio do Sudoeste (PR)',
        'Santo Inácio (PR)',
        'São Carlos do Ivaí (PR)',
        'São Jerônimo da Serra (PR)',
        'São João (PR)',
        'São João do Caiuá (PR)',
        'São João do Ivaí (PR)',
        'São João do Triunfo (PR)',
        'São Jorge do Ivaí (PR)',
        'São Jorge do Oeste (PR)',
        'São Jorge do Patrocínio (PR)',
        'São José da Boa Vista (PR)',
        'São José das Palmeiras (PR)',
        'São José dos Pinhais (PR)',
        'São Manoel do Paraná (PR)',
        'São Mateus do Sul (PR)',
        'São Miguel do Iguaçu (PR)',
        'São Pedro do Iguaçu (PR)',
        'São Pedro do Ivaí (PR)',
        'São Pedro do Paraná (PR)',
        'São Sebastião da Amoreira (PR)',
        'São Tomé (PR)',
        'Sapopema (PR)',
        'Sarandi (PR)',
        'Saudades do Iguaçu (PR)',
        'Sengés (PR)',
        'Serranópolis do Iguaçu (PR)',
        'Sertaneja (PR)',
        'Sertanópolis (PR)',
        'Siqueira Campos (PR)',
        'Sulinas (PR)',
        'Tamarana (PR)',
        'Tamboara (PR)',
        'Tapejara (PR)',
        'Tapira (PR)',
        'Teixeira Soares (PR)',
        'Telêmaco Borba (PR)',
        'Terra Boa (PR)',
        'Terra Rica (PR)',
        'Terra Roxa (PR)',
        'Tibagi (PR)',
        'Tijucas do Sul (PR)',
        'Toledo (PR)',
        'Tomazina (PR)',
        'Três Barras do Paraná (PR)',
        'Tunas do Paraná (PR)',
        'Tuneiras do Oeste (PR)',
        'Tupassi (PR)',
        'Turvo (PR)',
        'Ubiratã (PR)',
        'Umuarama (PR)',
        'União da Vitória (PR)',
        'Uniflor (PR)',
        'Uraí (PR)',
        'Ventania (PR)',
        'Vera Cruz do Oeste (PR)',
        'Verê (PR)',
        'Vila Alta (PR)',
        'Virmond (PR)',
        'Vitorino (PR)',
        'Wenceslau Bráz (PR)',
        'Xambrê (PR)',
    ],
    'SC': [
        'Florianópolis (SC)',
        'Joinville (SC)',
        'Blumenau (SC)',
        // ... (Adicionar TODOS os municípios de SC)
    ],
    'RS': [
        'Porto Alegre (RS)',
        'Canoas (RS)',
        'Caxias do Sul (RS)',
        'Passo Fundo (RS)',
        // ... (Adicionar TODOS os municípios de RS)
    ]
};


// --- VARIÁVEL GLOBAL PARA MAPA NORMALIZADO ---
// Usado pela busca para encontrar o ID do representante
let NORMALIZED_MUNICIPIOS_MAP = {};


// --- 2. FUNÇÕES AUXILIARES ---

/**
 * Normaliza uma string de entrada (remove acentos, minúsculas, etc.).
 */
function normalizeString(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

/**
 * Constrói o mapa normalizado (sem acentos) para a lógica de busca.
 */
function buildNormalizedMap() {
    const newMap = {};
    for (const key in MUNICIPIOS_MAP) {
        if (MUNICIPIOS_MAP.hasOwnProperty(key)) {
            const normalizedKey = normalizeString(key);
            newMap[normalizedKey] = MUNICIPIOS_MAP[key];
        }
    }
    NORMALIZED_MUNICIPIOS_MAP = newMap;
}

/**
 * Limpa o número de telefone para o link do WhatsApp.
 */
function cleanPhoneNumber(phone) {
    let cleaned = phone.replace(/\D/g, ""); 
    if (cleaned.length === 11 && !cleaned.startsWith('55')) {
        cleaned = '55' + cleaned;
    } else if (cleaned.length === 10 && !cleaned.startsWith('55')) {
        cleaned = '55' + cleaned;
    }
    return cleaned;
}

/**
 * ATUALIZAÇÃO: Popula o dropdown <select> do Select2.
 * AGORA LÊ DE "ALL_MUNICIPIOS_BY_STATE".
 */
function populateMunicipiosSelect(selectedEstado) {
    const municipioSelect = $('#municipio-select'); // JQuery selector
    if (!municipioSelect.length) return;

    // 1. Limpa as opções antigas
    municipioSelect.empty(); 

    // 2. Pega a lista completa de municípios para o estado selecionado
    // Usa o UF (ex: "PR") como chave
    const municipiosDoEstado = ALL_MUNICIPIOS_BY_STATE[selectedEstado] || [];

    // 3. Formata para o Select2
    const options = municipiosDoEstado.map(municipioKey => {
        // O "id" é o valor que será usado na busca (ex: "curitiba (pr)")
        // O "text" é o que o usuário vê (ex: "Curitiba (PR)")
        return {
            id: municipioKey, 
            text: municipioKey 
        };
    });

    // 4. Inicializa ou atualiza o Select2 com os novos dados
    municipioSelect.select2({
        data: options, // Popula o Select2 com os municípios filtrados
        placeholder: 'Digite ou selecione seu município...',
        width: '100%',
        theme: 'default' // Garante que ele use o tema padrão
    });
    
    // Habilita o dropdown de município
    municipioSelect.prop('disabled', false);
}

/**
 * Limpa os resultados da busca (chamado pelo botão "Fechar").
 */
function fecharResultados() {
    const resultsDiv = document.getElementById('search-results-display');
    if (resultsDiv) {
        resultsDiv.innerHTML = '';
        resultsDiv.className = 'mt-6'; 
    }
}

// --- 3. FUNÇÃO PRINCIPAL DE BUSCA ---

/**
 * Função principal acionada pelo botão "Buscar Representantes".
 * A lógica de busca NÃO MUDA. Ela ainda usa o MUNICIPIOS_MAP.
 * Se o município selecionado (ex: "Curitiba (PR)") não estiver no
 * MUNICIPIOS_MAP, ele cairá no "else" (Equipe Interna), que é o comportamento desejado.
 */
function buscarRepresentantes() {
    const estadoSelect = document.getElementById('estado-select');
    const municipioValor = $('#municipio-select').val(); // Pega o valor do Select2
    const resultsDiv = document.getElementById('search-results-display');

    if (!estadoSelect || !resultsDiv) {
        console.error('Elementos do formulário de busca não encontrados.');
        return;
    }

    const estadoValor = estadoSelect.value;

    fecharResultados();
    // ATUALIZAÇÃO: Adiciona classes de TEMA ESCURO
    resultsDiv.className = 'mt-6 relative p-4 border rounded-lg shadow-md dark-results-box';

    // --- Validação de Entrada ---
    if (estadoValor === "outros") {
        resultsDiv.innerHTML = `
            <button onclick="fecharResultados()" class="absolute top-2 right-3 text-2xl font-bold close-btn">&times;</button>
            <h3 class="text-xl font-semibold mb-2">Equipe Interna de Vendas</h3>
            <p>Para a sua região, por favor, entre em contato diretamente com nossa equipe interna de vendas.</p>
        `;
        return;
    }

    if (!estadoValor || !municipioValor) {
        // ATUALIZAÇÃO: Estilo de erro (mantido, mas agora no tema escuro)
        resultsDiv.className = 'mt-6 relative p-4 border border-red-500 bg-red-900 bg-opacity-30 text-red-200 rounded-lg shadow-md'; 
        resultsDiv.innerHTML = `
            <button onclick="fecharResultados()" class="absolute top-2 right-3 text-red-300 hover:text-red-100 text-2xl font-bold">&times;</button>
            <p class="font-medium">Por favor, selecione um Estado e um Município para realizar a busca.</p>
        `;
        return;
    }

    // --- LÓGICA DE BUSCA (Não muda) ---
    
    // 1. Normaliza a chave vinda do Select2 (ex: "abatiá (pr)" -> "abatia (pr)")
    const chaveBusca = normalizeString(municipioValor);
    
    // 2. Procura o ID do representante no mapa NORMALIZADO (que só tem reps mapeados)
    const repID = NORMALIZED_MUNICIPIOS_MAP[chaveBusca];
    
    // 3. Procura os detalhes do representante
    const representante = repID ? REPRESENTANTES_MAP[repID] : undefined;

    // --- Exibição dos Resultados ---
    if (representante) {
        // Caso: Representante Encontrado
        const telefoneLimpo = cleanPhoneNumber(representante.telefone);
        const whatsappLink = `https://wa.me/${telefoneLimpo}?text=Olá, ${representante.nome.split(' ')[0]}. Encontrei seu contato no site.`;

        resultsDiv.innerHTML = `
            <button onclick="fecharResultados()" class="absolute top-2 right-3 text-2xl font-bold close-btn">&times;</button>
            <h3 class="text-xl font-semibold mb-3">Representante Encontrado:</h3>
            <div class="space-y-2">
                <p><strong>Nome:</strong> ${representante.nome}</p>
                <div class="flex items-center gap-3">
                    <p><strong>Telefone:</strong> ${representante.telefone}</p>
                    <a href="${whatsappLink}" target="_blank" 
                       class="text-green-500 hover:text-green-400 transition-colors duration-200" 
                       title="Abrir no WhatsApp">
                        <i class="fa-brands fa-whatsapp fa-lg"></i>
                    </a>
                </div>
                <p><strong>Email:</strong> ${representante.email}</p>
            </div>
        `;
    } else {
        // Caso: Município não encontrado (cai aqui se a cidade foi omitida - "EM BRANCO")
        resultsDiv.innerHTML = `
            <button onclick="fecharResultados()" class="absolute top-2 right-3 text-2xl font-bold close-btn">&times;</button>
            <h3 class="text-xl font-semibold mb-2">Equipe Interna de Vendas Ditrator</h3>
            <p>Não encontramos um representante específico para <strong>${municipioValor}</strong>.</p>
            <p class="mt-2">Para a sua região, por favor, entre em contato com nossa equipe interna de vendas para assistência.</p>
        `;
    }
}

// --- 4. EVENT LISTENERS (ATUALIZADO PARA JQUERY) ---

$(document).ready(function() {
    // CRIA O MAPA NORMALIZADO AO CARREGAR A PÁGINA
    buildNormalizedMap(); 
    
    // Inicializa o Select2 no campo de município (começa desabilitado)
    $('#municipio-select').select2({
        placeholder: 'Primeiro, selecione um Estado...',
        width: '100%',
        theme: 'default'
    });

    // Adiciona o listener para filtrar o <select> de municípios
    $('#estado-select').on('change', function() {
        const estadoValor = $(this).val();
        
        // Limpa a seleção atual do município
        $('#municipio-select').val(null).trigger('change');
        
        if (estadoValor && estadoValor !== 'outros') {
            // Popula o Select2 de municípios com base no estado
            populateMunicipiosSelect(estadoValor); // <<< A FUNÇÃO ATUALIZADA SERÁ CHAMADA AQUI
            $('#municipio-select').prop('disabled', false);
        } else {
            // Se for 'outros' ou vazio, desabilita e reseta o placeholder
            $('#municipio-select').empty().select2({
                placeholder: (estadoValor === 'outros') ? 'Selecione "Buscar" para contato' : 'Primeiro, selecione um Estado...',
                width: '100%',
                theme: 'default'
            });
            $('#municipio-select').prop('disabled', true);
        }
    });
});