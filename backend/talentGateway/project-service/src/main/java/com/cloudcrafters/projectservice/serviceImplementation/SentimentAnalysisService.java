package com.cloudcrafters.projectservice.serviceImplementation;
import edu.stanford.nlp.pipeline.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Properties;

@Service
public class SentimentAnalysisService {

    private final StanfordCoreNLP pipeline;

    public SentimentAnalysisService() {
        // Configuration de CoreNLP pour l'analyse des sentiments
        Properties props = new Properties();
        props.setProperty("annotators", "tokenize,ssplit,pos,lemma,parse,sentiment");
        pipeline = new StanfordCoreNLP(props);
    }

    public String analyzeSentiment(String text) {
        // Créer un document NLP
        CoreDocument document = new CoreDocument(text);

        // Annoter le document pour obtenir des analyses
        pipeline.annotate(document);

        // Obtenir la première phrase annotée
        List<CoreSentence> sentences = document.sentences();
        if (sentences.isEmpty()) {
            return "neutral"; // ou tout autre comportement souhaité en cas de texte vide
        }

        CoreSentence sentence = sentences.get(0);
        String sentiment = sentence.sentiment().toLowerCase(); // "neutral", "positive", "negative", etc.

        return sentiment;
    }
}
