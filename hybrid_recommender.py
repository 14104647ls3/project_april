#import libraries
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import TruncatedSVD
import sys

import warnings
warnings.filterwarnings("ignore", message="invalid value encountered in divide")
##init
games = pd.read_csv('../1000_games_from_steam_2022_to_2014.csv')
games_data = pd.read_csv('../games_data.csv')

def recommend_similar_games(prompt):

    ##init##
    vectorizer = CountVectorizer()
    features_matrix = vectorizer.fit_transform([prompt])
    num_features = len(vectorizer.get_feature_names_out())-1

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(games['full_metadata'])
    tfidf_df = pd.DataFrame(tfidf_matrix.toarray(), index=games.index.tolist())

    ##svd##
    svd = TruncatedSVD(n_components=num_features)
    latent_matrix = svd.fit_transform(tfidf_df)
    latent_matrix_1_df = pd.DataFrame(latent_matrix[:,0:num_features], index=games.Name.tolist())

    ##prompt##
    prompt_list = [prompt]
    tfidf_prompt_matrix = tfidf.fit_transform(prompt_list)
    tfidf_prompt_df = pd.DataFrame(tfidf_prompt_matrix.toarray())
    latent_prompt_matrix = svd.fit_transform(tfidf_prompt_df)
    latent_prompt_matrix_df = pd.DataFrame(latent_prompt_matrix[:,0:num_features])
    
    a_1 = np.array(latent_prompt_matrix_df).reshape(1, -1)
    #reshape a_1 to match the num of columns 
    a_1 = np.repeat(a_1, latent_matrix_1_df.shape[1], axis=1)

    ##l2##
    svd_l2 = TruncatedSVD(n_components=50)
    games_data_numeric = games_data.drop(columns=['Name'])
    latent_matrix_2 = svd_l2.fit_transform(games_data_numeric)
    latent_matrix_2_df = pd.DataFrame(
                             latent_matrix_2, index=games_data.Name.tolist())
    

    # calculate the similartity of this game with the others in the list
    score_1 = cosine_similarity(latent_matrix_1_df, a_1).reshape(-1)

    content_dictDf = {'content': score_1}
    content_similar = pd.DataFrame(content_dictDf, index = latent_matrix_1_df.index)

    #sort it on the basis of either: content, collaborative or hybrid
    content_similar.sort_values('content', ascending=False, inplace=True)

    # Extract the top recommended games (excluding the first one, as it will be the input game itself)
    recommended_games = content_similar.index[1:11].tolist()


    #collaborative 
    scores_list = []

    # Loop through recommended_games[0] to recommended_games[9]
    for i in range(10):  # Loop from 0 to 9
        # Calculate the index for the recommended game
        index = recommended_games[i]
        # Extract the corresponding row from latent_matrix_2_df and reshape it
        a_collab_i = np.array(latent_matrix_2_df.loc[index]).reshape(1, -1)
        # Calculate the cosine similarity scores between a_i and all other rows
        score_collab_i = cosine_similarity(latent_matrix_2_df, a_collab_i).reshape(-1)
        # Append the scores to the scores_list
        scores_list.append(score_collab_i)

    # Calculate the final score
    final_score = sum(score * (10 - i) for i, score in enumerate(scores_list))


    #final result
    hybrid = ((score_1 + (final_score/55))/2.0)
    dictDf = {'content': score_1 , 'collaborative': final_score/55, 'hybrid': hybrid}
    similar = pd.DataFrame(dictDf, index = latent_matrix_2_df.index)
    similar.sort_values('hybrid', ascending=False, inplace=True)

    gameNameList = list(similar[1:].head(11).index)
    appIdList = []
    
    for i in gameNameList:
        appid = getAppIDByName(i)
        appIdList.append(appid)
    print(appIdList[0:9])
    return appIdList[0:9]

def getAppIDByName(gameName):
    # Read the CSV file into a pandas DataFrame
    #df = pd.read_csv('./1000_games_from_steam_2022_to_2014.csv')

    # Filter the DataFrame to get the row with the specified App ID
    game_row = games[games['Name'] == gameName]

    # If a matching row is found, return the game name, otherwise return None
    if not game_row.empty:
        return game_row.iloc[0]['AppID']
    else:
        return None

def main(prompt):
    recommend_similar_games(prompt)

if __name__ == "__main__":
    # Check if there's exactly one command-line argument (excluding the script name itself)
    if len(sys.argv) != 2:
        print("Usage: python script_name.py <prompt>")
        sys.exit(1)
        
    # Get the prompt from the command-line argument
    user_prompt = sys.argv[1]
    main(user_prompt)