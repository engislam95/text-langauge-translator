import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css'

const LanguageTranslator = () => {
  const [languagesList, setLanguagesList] = useState([])
  const [inputText, setUserInputText] = useState('')
  const [fetchedlanguageKey, setFetchedLanguageKey] = useState('')
  const [languageKey, setLanguageKey] = useState('')
  const [translatedResultText, setTranslatedResultText] = useState('')

  useEffect(() => {
    axios.get(`https://libretranslate.de/languages`).then((response) => {
      setLanguagesList(response.data)
    })
    getLanguageSource()
  }, [inputText])

  const getLanguageSource = () => {
    axios
      .post(`https://libretranslate.de/detect`, {
        q: inputText
      })
      .then((response) => {
        setFetchedLanguageKey(response.data[0].language)
      })
  }

  const SelectLanguageKey = (selectedLanguage) => {
    setLanguageKey(selectedLanguage)
  }

  const translateText = () => {
    getLanguageSource()

    let data = {
      q: inputText,
      source: fetchedlanguageKey,
      target: languageKey
    }
    axios
      .post(`https://libretranslate.de/translate`, data)
      .then((response) => {
        setTranslatedResultText(response.data.translatedText)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className='container'>
      <Form className='mt-5'>
        <fieldset>
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='inputText'>Enter your text ...</Form.Label>
            <Form.Control
              id='inputText'
              as='textarea'
              rows={3}
              placeholder='Enter your text'
              onChange={(e) => setUserInputText(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='selectLanguage'>
              Select Language ...
            </Form.Label>
            <Form.Select
              id='selectLanguage'
              onChange={(e) => SelectLanguageKey(e.target.value)}
            >
              <option>Language</option>
              {languagesList.map((language) => {
                return (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                )
              })}
            </Form.Select>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label htmlFor='resultText'>Your translated text</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              id='resultText'
              disabled 
              value={translatedResultText}
            />
          </Form.Group>

          <Button type='button' onClick={translateText} disabled={!languageKey}>
            Translate
          </Button>
        </fieldset>
      </Form>
    </div>
  )
}

export default LanguageTranslator
