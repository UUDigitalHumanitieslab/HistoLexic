# This is a basic standalone version of the HistoLexic demontstrator in Python
# Uses the requests package (http://docs.python-requests.org/en/latest/)

import requests

BASE_URL = 'http://lexiconservice.inl.nl/lexicon/'
LEMMA_URL = 'get_lemma'
WORDFORM_URL = 'get_wordforms'
EXPAND_URL = 'expand'


def find_lemma(wordform):
    print '====='
    print 'Finding lemmata of ' + wordform

    search_term = dict()
    search_term['database'] = 'lexicon_service_db'
    search_term['wordform'] = wordform
    #search_term['year_from'] = 1600
    #search_term['year_to'] = 2000
    #search_term['pos'] = 'VRB'

    r = requests.get(BASE_URL + LEMMA_URL, params=search_term, headers={'Accept': 'application/json'})
    print 'url: ' + r.url
    print 'lemmata: '

    for j in r.json()['lemmata_list']:
        for l in j['found_lemmata']:
            print l['lemma'] + ' - ' + l['pos'] + ', ',


def find_wordform(lemma):
    print ''
    print '====='
    print 'Finding wordforms of ' + lemma

    search_term = dict()
    search_term['database'] = 'lexicon_service_db'
    search_term['lemma'] = lemma
    #search_term['year_from'] = 1900
    #search_term['year_to'] = 2000
    #search_term['pos'] = 'VRB'

    r = requests.get(BASE_URL + WORDFORM_URL, params=search_term, headers={'Accept': 'application/json'})
    print 'url: ' + r.url
    print 'wordforms:'

    for j in r.json()['wordforms_list']:
        print ', '.join(j['found_wordforms'])


def expand(wordform):
    print '====='
    print 'Expanding wordform ' + wordform

    search_term = dict()
    search_term['database'] = 'lexicon_service_db'
    search_term['wordform'] = wordform
    #search_term['year_from'] = 1600
    #search_term['year_to'] = 2000
    #search_term['pos'] = 'VRB'

    r = requests.get(BASE_URL + EXPAND_URL, params=search_term, headers={'Accept': 'application/json'})
    print 'url: ' + r.url
    print r.request.headers
    print 'wordforms:'

    for j in r.json()['wordforms_list']:
        print ', '.join(j['found_wordforms'])

if __name__ == "__main__":
    find_lemma('bank')
    find_wordform('bank')
    expand('bank')
