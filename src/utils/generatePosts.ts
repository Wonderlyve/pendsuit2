import { supabase } from '@/integrations/supabase/client';

// Données des matchs fournies
const matchesData = [
  { team1: "Abbey Hey", team2: "AFC Liverpool", date: "02/08/2025", time: "15:00", code: "37243920-1-", competition: "FA" },
  { team1: "Ware FC", team2: "Welwyn", date: "02/08/2025", time: "15:00", code: "37243920-1-", competition: "FA" },
  { team1: "Oldland Abbotonians", team2: "Wallingford & Crowmarsh", date: "02/08/2025", time: "15:00", code: "343630X2-2-", competition: "FA" },
  { team1: "Coleshill Town", team2: "Nuneaton", date: "02/08/2025", time: "15:00", code: "30165421-2-", competition: "FA" },
  { team1: "March Town United", team2: "Soham Town Rangers", date: "02/08/2025", time: "15:00", code: "34303621-2-", competition: "FA" },
  { team1: "Bottesford Town", team2: "Melton Town", date: "02/08/2025", time: "15:00", code: "38224022-4-", competition: "FA" },
  { team1: "AFC Wulfrunians", team2: "Shepshed Dynamo", date: "02/08/2025", time: "15:00", code: "23294820-2-", competition: "FA" },
  { team1: "Eversley & California", team2: "Horndean", date: "02/08/2025", time: "15:00", code: "28185422-3-", competition: "FA" },
  { team1: "Cornard United FC", team2: "Woodbridge Town", date: "02/08/2025", time: "15:00", code: "35184720-2-", competition: "FA" },
  { team1: "City of Liverpool", team2: "Euxton Villa", date: "02/08/2025", time: "15:00", code: "45312413-1-", competition: "FA" },
  { team1: "Downton", team2: "Fareham Town", date: "02/08/2025", time: "15:00", code: "25185721-7-", competition: "FA" },
  { team1: "Bashley", team2: "East Cowes Victoria Athletic", date: "02/08/2025", time: "15:00", code: "59103113-0-", competition: "FA" },
  { team1: "Irlam", team2: "Thackley", date: "02/08/2025", time: "15:00", code: "33323520-4-", competition: "FA" },
  { team1: "Liversedge", team2: "Wythenshawe Amateurs", date: "02/08/2025", time: "15:00", code: "53182911-0-", competition: "FA" },
  { team1: "Milton Keynes Irish", team2: "Heybridge Swifts", date: "02/08/2025", time: "15:00", code: "41223712-1-", competition: "FA" },
  { team1: "St Neots Town", team2: "Great Yarmouth Town", date: "02/08/2025", time: "15:00", code: "65201513-0-", competition: "FA" },
  { team1: "Shifnal Town", team2: "Coventry United", date: "02/08/2025", time: "15:00", code: "47322211-0-", competition: "FA" },
  { team1: "AFC Stoneham", team2: "Fleet Town", date: "02/08/2025", time: "15:00", code: "30343621-5-", competition: "FA" },
  { team1: "Marske United", team2: "Carlisle City", date: "02/08/2025", time: "15:00", code: "69141713-0-", competition: "FA" },
  { team1: "Alton", team2: "Wincanton Town", date: "02/08/2025", time: "15:00", code: "34303621-4-", competition: "FA" },
  { team1: "Biggleswade FC", team2: "Welwyn Garden City", date: "02/08/2025", time: "15:00", code: "382537", competition: "FA" }
];

// Utilisateurs avec leurs IDs simulés
const users = [
  { username: "Winpro", display_name: "Win Pro", user_id: "11111111-1111-1111-1111-111111111111", badge: "Expert" },
  { username: "winwin", display_name: "Win Win", user_id: "22222222-2222-2222-2222-222222222222", badge: "Pro" },
  { username: "Patrickprono", display_name: "Patrick Prono", user_id: "33333333-3333-3333-3333-333333333333", badge: "Expert" },
  { username: "starwin", display_name: "Star Win", user_id: "44444444-4444-4444-4444-444444444444", badge: "Pro" },
  { username: "victoirepro", display_name: "Victoire Pro", user_id: "55555555-5555-5555-5555-555555555555", badge: "Expert" }
];

// Types de paris possibles
const betTypes = ["1X2", "BTTS", "Plus/Moins 2.5", "Handicap", "Corner", "Double Chance"];

// Prédictions possibles
const predictions = {
  "1X2": ["Victoire 1", "Nul", "Victoire 2"],
  "BTTS": ["Oui", "Non"],
  "Plus/Moins 2.5": ["Plus de 2.5", "Moins de 2.5"],
  "Handicap": ["Handicap +1", "Handicap -1", "Handicap +2"],
  "Corner": ["Plus de 9.5", "Moins de 9.5"],
  "Double Chance": ["1X", "X2", "12"]
};

// Fonction pour générer une cote aléatoire réaliste
const generateOdds = (betType: string, prediction: string): number => {
  const baseOdds = {
    "1X2": { "Victoire 1": [1.5, 3.5], "Nul": [2.8, 4.2], "Victoire 2": [1.8, 4.0] },
    "BTTS": { "Oui": [1.6, 2.4], "Non": [1.4, 2.2] },
    "Plus/Moins 2.5": { "Plus de 2.5": [1.7, 2.5], "Moins de 2.5": [1.5, 2.3] },
    "Handicap": { "Handicap +1": [1.3, 1.9], "Handicap -1": [1.8, 2.8], "Handicap +2": [1.1, 1.7] },
    "Corner": { "Plus de 9.5": [1.8, 2.6], "Moins de 9.5": [1.6, 2.4] },
    "Double Chance": { "1X": [1.2, 1.8], "X2": [1.3, 1.9], "12": [1.1, 1.6] }
  };
  
  const range = baseOdds[betType as keyof typeof baseOdds]?.[prediction as keyof any] || [1.5, 3.0];
  return Math.round((Math.random() * (range[1] - range[0]) + range[0]) * 100) / 100;
};

// Analyses prédéfinies pour rendre les posts réalistes
const analysisTemplates = [
  "Analyse technique approfondie de ce match. L'équipe domicile montre une forme excellente avec 4 victoires sur les 5 derniers matchs.",
  "Statistiques clés: défense solide, attaque efficace. Je recommande ce pari avec confiance basée sur l'historique des confrontations.",
  "Match intéressant avec des cotes attractives. L'analyse des dernières performances suggère une issue favorable.",
  "Pronostic basé sur l'analyse des blessures et de la forme récente des équipes. Pari sûr selon mes calculs.",
  "Excellent rapport risque/récompense sur ce match. Les statistiques H2H favorisent nettement cette prédiction.",
  "Analyse météo et terrain prise en compte. Conditions parfaites pour ce type de pari selon mon expertise.",
  "Form guide détaillé étudié. Cette équipe performe exceptionnellement bien à domicile cette saison.",
  "Pari value détecté après analyse approfondie des cotes et probabilités réelles du marché.",
  "Match clé de la journée! Mon analyse technique indique une probabilité élevée de succès pour ce pronostic.",
  "Expertise terrain: j'ai analysé 15 facteurs différents pour établir ce pronostic avec haute confiance."
];

export const generateAllPosts = async () => {
  console.log('Début de la génération des posts...');
  
  try {
    // D'abord, créer les profils utilisateurs s'ils n'existent pas
    for (const user of users) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.user_id)
        .single();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.user_id,
            username: user.username,
            display_name: user.display_name,
            badge: user.badge,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
          });

        if (profileError) {
          console.error(`Erreur création profil ${user.username}:`, profileError);
        } else {
          console.log(`Profil créé pour ${user.username}`);
        }
      }
    }

    // Générer 10 posts pour chaque utilisateur
    for (const user of users) {
      console.log(`Génération des posts pour ${user.username}...`);
      
      for (let i = 0; i < 10; i++) {
        // Sélectionner un match aléatoire
        const match = matchesData[Math.floor(Math.random() * matchesData.length)];
        
        // Sélectionner un type de pari aléatoire
        const betType = betTypes[Math.floor(Math.random() * betTypes.length)];
        
        // Sélectionner une prédiction aléatoire pour ce type de pari
        const possiblePredictions = predictions[betType as keyof typeof predictions];
        const prediction = possiblePredictions[Math.floor(Math.random() * possiblePredictions.length)];
        
        // Générer une cote
        const odds = generateOdds(betType, prediction);
        
        // Sélectionner une analyse aléatoire
        const analysis = analysisTemplates[Math.floor(Math.random() * analysisTemplates.length)];
        
        // Générer une confiance aléatoire (70-95%)
        const confidence = Math.floor(Math.random() * 26) + 70;
        
        // Créer le post
        const postData = {
          user_id: user.user_id,
          content: analysis,
          sport: "Football",
          match_teams: `${match.team1} vs ${match.team2}`,
          prediction_text: `${betType}: ${prediction}`,
          analysis: analysis,
          bet_type: betType,
          odds: odds,
          confidence: confidence,
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 10),
          views: Math.floor(Math.random() * 200) + 50
        };

        const { error } = await supabase
          .from('posts')
          .insert(postData);

        if (error) {
          console.error(`Erreur création post ${i+1} pour ${user.username}:`, error);
        } else {
          console.log(`Post ${i+1}/10 créé pour ${user.username}`);
        }

        // Petite pause pour éviter de surcharger la base
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log('Génération terminée! 50 posts créés au total.');
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération des posts:', error);
    return false;
  }
};