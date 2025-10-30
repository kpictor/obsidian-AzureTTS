# Text to speech REST API

- 10/21/2025

The Speech service allows you to [convert text into synthesized speech](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#convert-text-to-speech) and [get a list of supported voices](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#get-a-list-of-voices) for a region by using a REST API. In this article, you learn about authorization options, query options, how to structure a request, and how to interpret a response.

 Tip

Use cases for the text to speech REST API are limited. Use it only in cases where you can't use the [Speech SDK](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-sdk). For example, with the Speech SDK you can [subscribe to events](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-speech-synthesis#subscribe-to-synthesizer-events) for more insights about the text to speech processing and results.

The text to speech REST API supports neural text to speech voices in many locales. Each available endpoint is associated with a region. An API key for the endpoint or region that you plan to use is required. Here are links to more information:

- For a complete list of voices, see [Language and voice support for the Speech service](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts).
- For information about regional availability, see [Speech service supported regions](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/regions#regions).
- For Azure Government and Microsoft Azure operated by 21Vianet endpoints, see [this article about sovereign clouds](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/sovereign-clouds).

 Important

Costs vary for standard voices and custom voices. For more information, see [text to speech pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

Before you use the text to speech REST API, understand that you need to complete a token exchange as part of authentication to access the service. For more information, see [Authentication](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#authentication).

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#get-a-list-of-voices)

## Get a list of voices

You can use the `tts.speech.microsoft.com/cognitiveservices/voices/list` endpoint to get a full list of voices for a specific region or endpoint. Prefix the voices list endpoint with a region to get a list of voices for that region. For example, to get a list of voices for the `westus` region, use the `https://westus.tts.speech.microsoft.com/cognitiveservices/voices/list` endpoint. For a list of all supported regions, see the [regions](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/regions) documentation.

 Note

[Voices and styles in preview](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts) are only available in a subset of regions. For the current list of regions that support voices and styles in public preview, see the [Speech service regions table](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/regions?tabs=tts).

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#request-headers)

### Request headers

This table lists required and optional headers for text to speech requests:

|Header|Description|Required or optional|
|---|---|---|
|`Ocp-Apim-Subscription-Key`|Your Speech resource key.|Either this header or `Authorization` is required.|
|`Authorization`|An authorization token preceded by the word `Bearer`. For more information, see [Authentication](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#authentication).|Either this header or `Ocp-Apim-Subscription-Key` is required.|

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#request-body)

### Request body

A body isn't required for `GET` requests to this endpoint.

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#sample-request)

### Sample request

This request requires only an authorization header:

HTTPCopy

```
GET /cognitiveservices/voices/list HTTP/1.1

Host: westus.tts.speech.microsoft.com
Ocp-Apim-Subscription-Key: YOUR_RESOURCE_KEY
```

Here's an example curl command:

curlCopy

```
curl --location --request GET 'https://YOUR_RESOURCE_REGION.tts.speech.microsoft.com/cognitiveservices/voices/list' \
--header 'Ocp-Apim-Subscription-Key: YOUR_RESOURCE_KEY'
```

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#sample-response)

### Sample response

You should receive a response with a JSON body that includes all supported locales, voices, gender, styles, and other details. The `WordsPerMinute` property for each voice can be used to estimate the length of the output speech. This JSON example shows partial results to illustrate the structure of a response:

JSONCopy

```
[
    // Redacted for brevity
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)",
        "DisplayName": "Jenny",
        "LocalName": "Jenny",
        "ShortName": "en-US-JennyNeural",
        "Gender": "Female",
        "Locale": "en-US",
        "LocaleName": "English (United States)",
        "StyleList": [
          "assistant",
          "chat",
          "customerservice",
          "newscast",
          "angry",
          "cheerful",
          "sad",
          "excited",
          "friendly",
          "terrified",
          "shouting",
          "unfriendly",
          "whispering",
          "hopeful"
        ],
        "SampleRateHertz": "24000",
        "VoiceType": "Neural",
        "Status": "GA",
        "ExtendedPropertyMap": {
          "IsHighQuality48K": "True"
        },
        "WordsPerMinute": "152"
    },
    // Redacted for brevity
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (en-US, JennyMultilingualNeural)",
        "DisplayName": "Jenny Multilingual",
        "LocalName": "Jenny Multilingual",
        "ShortName": "en-US-JennyMultilingualNeural",
        "Gender": "Female",
        "Locale": "en-US",
        "LocaleName": "English (United States)",
        "SecondaryLocaleList": [
          "de-DE",
          "en-AU",
          "en-CA",
          "en-GB",
          "es-ES",
          "es-MX",
          "fr-CA",
          "fr-FR",
          "it-IT",
          "ja-JP",
          "ko-KR",
          "pt-BR",
          "zh-CN"
        ],
        "SampleRateHertz": "24000",
        "VoiceType": "Neural",
        "Status": "GA",
        "WordsPerMinute": "190"
    },
    // Redacted for brevity
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (ga-IE, OrlaNeural)",
        "DisplayName": "Orla",
        "LocalName": "Orla",
        "ShortName": "ga-IE-OrlaNeural",
        "Gender": "Female",
        "Locale": "ga-IE",
        "LocaleName": "Irish (Ireland)",
        "SampleRateHertz": "24000",
        "VoiceType": "Neural",
        "Status": "GA",
        "WordsPerMinute": "139"
    },
    // Redacted for brevity
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, YunxiNeural)",
        "DisplayName": "Yunxi",
        "LocalName": "云希",
        "ShortName": "zh-CN-YunxiNeural",
        "Gender": "Male",
        "Locale": "zh-CN",
        "LocaleName": "Chinese (Mandarin, Simplified)",
        "StyleList": [
          "narration-relaxed",
          "embarrassed",
          "fearful",
          "cheerful",
          "disgruntled",
          "serious",
          "angry",
          "sad",
          "depressed",
          "chat",
          "assistant",
          "newscast"
        ],
        "SampleRateHertz": "24000",
        "VoiceType": "Neural",
        "Status": "GA",
        "RolePlayList": [
          "Narrator",
          "YoungAdultMale",
          "Boy"
        ],
        "WordsPerMinute": "293"
    },
    // Redacted for brevity
]
```

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#http-status-codes)

### HTTP status codes

The HTTP status code for each response indicates success or common errors.

|HTTP status code|Description|Possible reason|
|---|---|---|
|200|OK|The request was successful.|
|400|Bad request|A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common reason is a header that's too long.|
|401|Unauthorized|The request isn't authorized. Make sure your resource key or token is valid and in the correct region.|
|429|Too many requests|You exceeded the quota or rate of requests allowed for your resource.|
|502|Bad gateway|There's a network or server-side problem. This status might also indicate invalid headers.|

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#convert-text-to-speech)

## Convert text to speech

The `cognitiveservices/v1` endpoint allows you to convert text to speech by using [Speech Synthesis Markup Language (SSML)](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup).

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#regions-and-endpoints)

### Regions and endpoints

These regions are supported for text to speech through the REST API. Be sure to select the endpoint that matches your Speech resource region.

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#standard-voices)

### Standard voices

Use this table to determine _availability of neural voices_ by region or endpoint:

|Region|Endpoint|
|---|---|
|Australia East|`https://australiaeast.tts.speech.microsoft.com/cognitiveservices/v1`|
|Brazil South|`https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/v1`|
|Canada Central|`https://canadacentral.tts.speech.microsoft.com/cognitiveservices/v1`|
|Canada East|`https://canadaeast.tts.speech.microsoft.com/cognitiveservices/v1`|
|Central US|`https://centralus.tts.speech.microsoft.com/cognitiveservices/v1`|
|East Asia|`https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1`|
|East US|`https://eastus.tts.speech.microsoft.com/cognitiveservices/v1`|
|East US 2|`https://eastus2.tts.speech.microsoft.com/cognitiveservices/v1`|
|France Central|`https://francecentral.tts.speech.microsoft.com/cognitiveservices/v1`|
|Germany West Central|`https://germanywestcentral.tts.speech.microsoft.com/cognitiveservices/v1`|
|India Central|`https://centralindia.tts.speech.microsoft.com/cognitiveservices/v1`|
|Italy North|`https://italynorth.tts.speech.microsoft.com/cognitiveservices/v1`|
|Japan East|`https://japaneast.tts.speech.microsoft.com/cognitiveservices/v1`|
|Japan West|`https://japanwest.tts.speech.microsoft.com/cognitiveservices/v1`|
|Korea Central|`https://koreacentral.tts.speech.microsoft.com/cognitiveservices/v1`|
|North Central US|`https://northcentralus.tts.speech.microsoft.com/cognitiveservices/v1`|
|North Europe|`https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1`|
|Norway East|`https://norwayeast.tts.speech.microsoft.com/cognitiveservices/v1`|
|Qatar Central|`https://qatarcentral.tts.speech.microsoft.com/cognitiveservices/v1`|
|South Africa North|`https://southafricanorth.tts.speech.microsoft.com/cognitiveservices/v1`|
|South Central US|`https://southcentralus.tts.speech.microsoft.com/cognitiveservices/v1`|
|Southeast Asia|`https://southeastasia.tts.speech.microsoft.com/cognitiveservices/v1`|
|Sweden Central|`https://swedencentral.tts.speech.microsoft.com/cognitiveservices/v1`|
|Switzerland North|`https://switzerlandnorth.tts.speech.microsoft.com/cognitiveservices/v1`|
|Switzerland West|`https://switzerlandwest.tts.speech.microsoft.com/cognitiveservices/v1`|
|UAE North|`https://uaenorth.tts.speech.microsoft.com/cognitiveservices/v1`|
|UK South|`https://uksouth.tts.speech.microsoft.com/cognitiveservices/v1`|
|UK West|`https://ukwest.tts.speech.microsoft.com/cognitiveservices/v1`|
|US Gov Arizona|`https://usgovarizona.tts.speech.azure.us/cognitiveservices/v1`|
|US Gov Virginia|`https://usgovvirginia.tts.speech.azure.us/cognitiveservices/v1`|
|West Central US|`https://westcentralus.tts.speech.microsoft.com/cognitiveservices/v1`|
|West Europe|`https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1`|
|West US|`https://westus.tts.speech.microsoft.com/cognitiveservices/v1`|
|West US 2|`https://westus2.tts.speech.microsoft.com/cognitiveservices/v1`|
|West US 3|`https://westus3.tts.speech.microsoft.com/cognitiveservices/v1`|

 Tip

For the current list of regions that support voices in preview, see the [Speech service regions table](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/regions?tabs=tts).

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#custom-voices)

### Custom voices

If you created a custom voice, use the endpoint that you created. You can also use the following endpoints. Replace `{deploymentId}` with the deployment ID for your custom voice model.

|Region|Training|Deployment|Endpoint|
|---|---|---|---|
|Australia East|Yes|Yes|`https://australiaeast.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Brazil South|No|Yes|`https://brazilsouth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Canada Central|No|Yes|`https://canadacentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Central US|No|Yes|`https://centralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|East Asia|No|Yes|`https://eastasia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|East US|Yes|Yes|`https://eastus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|East US 2|Yes|Yes|`https://eastus2.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|France Central|No|Yes|`https://francecentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Germany West Central|No|Yes|`https://germanywestcentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|India Central|Yes|Yes|`https://centralindia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Italy North|No|Yes|`https://italynorth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Japan East|Yes|Yes|`https://japaneast.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Japan West|No|Yes|`https://japanwest.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Korea Central|Yes|Yes|`https://koreacentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|North Central US|No|Yes|`https://northcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|North Europe|Yes|Yes|`https://northeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Norway East|No|Yes|`https://norwayeast.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|South Africa North|No|Yes|`https://southafricanorth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|South Central US|Yes|Yes|`https://southcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Southeast Asia|Yes|Yes|`https://southeastasia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Sweden Central|No|Yes|`https://swedencentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Switzerland North|No|Yes|`https://switzerlandnorth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|Switzerland West|No|Yes|`https://switzerlandwest.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|UAE North|No|Yes|`https://uaenorth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|UK South|Yes|Yes|`https://uksouth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|West Central US|No|Yes|`https://westcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|West Europe|Yes|Yes|`https://westeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|West US|Yes|Yes|`https://westus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|West US 2|Yes|Yes|`https://westus2.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
|West US 3|No|Yes|`https://westus3.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|

 Note

The preceding regions are available for standard voice model hosting and real-time synthesis. Custom voice training is only available in some regions. But you can easily [copy a custom voice model](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/professional-voice-train-voice) from these regions to other regions in the preceding list.

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#long-audio-api)

### Long Audio API

The Long Audio API is available in multiple regions with unique endpoints:

|Region|Endpoint|
|---|---|
|Australia East|`https://australiaeast.customvoice.api.speech.microsoft.com`|
|East US|`https://eastus.customvoice.api.speech.microsoft.com`|
|India Central|`https://centralindia.customvoice.api.speech.microsoft.com`|
|South Central US|`https://southcentralus.customvoice.api.speech.microsoft.com`|
|Southeast Asia|`https://southeastasia.customvoice.api.speech.microsoft.com`|
|UK South|`https://uksouth.customvoice.api.speech.microsoft.com`|
|West Europe|`https://westeurope.customvoice.api.speech.microsoft.com`|

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#request-headers-1)

### Request headers

This table lists required and optional headers for text to speech requests:

|Header|Description|Required or optional|
|---|---|---|
|`Authorization`|An authorization token preceded by the word `Bearer`. For more information, see [Authentication](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#authentication).|Required|
|`Content-Type`|Specifies the content type for the provided text. Accepted value: `application/ssml+xml`.|Required|
|`X-Microsoft-OutputFormat`|Specifies the audio output format. For a complete list of accepted values, see [Audio outputs](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#audio-outputs).|Required|
|`User-Agent`|The application name. The provided value must be fewer than 255 characters.|Required|

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#request-body-1)

### Request body

If you're using a custom voice, the body of a request can be sent as plain text (ASCII or UTF-8). Otherwise, the body of each `POST` request is sent as [SSML](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup). SSML allows you to choose the voice and language of the synthesized speech that the text to speech feature returns. For a complete list of supported voices, see [Language and voice support for the Speech service](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts).

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#sample-request-1)

### Sample request

This HTTP request uses SSML to specify the voice and language. If the body length is long, and the resulting audio exceeds 10 minutes, it's truncated to 10 minutes. In other words, the audio length can't exceed 10 minutes.

HTTPCopy

```
POST /cognitiveservices/v1 HTTP/1.1

X-Microsoft-OutputFormat: riff-24khz-16bit-mono-pcm
Content-Type: application/ssml+xml
Host: westus.tts.speech.microsoft.com
Content-Length: <Length>
Authorization: Bearer [Base64 access_token]
User-Agent: <Your application name>

<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Male'
    name='en-US-ChristopherNeural'>
        I'm excited to try text to speech!
</voice></speak>
```

* For the Content-Length, you should use your own content length. In most cases, this value is calculated automatically.

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#http-status-codes-1)

### HTTP status codes

The HTTP status code for each response indicates success or common errors:

|HTTP status code|Description|Possible reason|
|---|---|---|
|200|OK|The request was successful. The response body is an audio file.|
|400|Bad request|A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common reason is a header that's too long.|
|401|Unauthorized|The request isn't authorized. Make sure your Speech resource key or token is valid and in the correct region.|
|415|Unsupported media type|It's possible that the wrong `Content-Type` value was provided. `Content-Type` should be set to `application/ssml+xml`.|
|429|Too many requests|You exceeded the quota or rate of requests allowed for your resource.|
|502|Bad gateway|There's a network or server-side problem. This status might also indicate invalid headers.|
|503|Service Unavailable|There's a server-side problem for various reasons.|

If the HTTP status is `200 OK`, the body of the response contains an audio file in the requested format. This file can be played as it's transferred, saved to a buffer, or saved to a file.

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#audio-outputs)

## Audio outputs

The supported streaming and nonstreaming audio formats are sent in each request as the `X-Microsoft-OutputFormat` header. Each format incorporates a bit rate and encoding type. The Speech service supports 48-kHz, 24-kHz, 16-kHz, and 8-kHz audio outputs. Each standard voice model is available at 24kHz and high-fidelity 48kHz.

- [Streaming](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#tabpanel_1_streaming)
- [NonStreaming](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#tabpanel_1_nonstreaming)

Copy

```
amr-wb-16000hz
audio-16khz-16bit-32kbps-mono-opus
audio-16khz-32kbitrate-mono-mp3
audio-16khz-64kbitrate-mono-mp3
audio-16khz-128kbitrate-mono-mp3
audio-24khz-16bit-24kbps-mono-opus
audio-24khz-16bit-48kbps-mono-opus
audio-24khz-48kbitrate-mono-mp3
audio-24khz-96kbitrate-mono-mp3
audio-24khz-160kbitrate-mono-mp3
audio-48khz-96kbitrate-mono-mp3
audio-48khz-192kbitrate-mono-mp3
g722-16khz-64kbps
ogg-16khz-16bit-mono-opus
ogg-24khz-16bit-mono-opus
ogg-48khz-16bit-mono-opus
raw-8khz-8bit-mono-alaw
raw-8khz-8bit-mono-mulaw
raw-8khz-16bit-mono-pcm
raw-16khz-16bit-mono-pcm
raw-16khz-16bit-mono-truesilk
raw-22050hz-16bit-mono-pcm
raw-24khz-16bit-mono-pcm
raw-24khz-16bit-mono-truesilk
raw-44100hz-16bit-mono-pcm
raw-48khz-16bit-mono-pcm
webm-16khz-16bit-mono-opus
webm-24khz-16bit-24kbps-mono-opus
webm-24khz-16bit-mono-opus
```

 Note

If you select 48kHz output format, the high-fidelity voice model with 48kHz will be invoked accordingly. The sample rates other than 24kHz and 48kHz can be obtained through upsampling or downsampling when synthesizing, for example, 44.1kHz is downsampled from 48kHz.

If your selected voice and output format have different bit rates, the audio is resampled as necessary. You can decode the `ogg-24khz-16bit-mono-opus` format by using the [Opus codec](https://opus-codec.org/downloads/).

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#authentication)

## Authentication

Each request requires an authorization header. This table illustrates which headers are supported for each feature:

|Supported authorization header|Speech to text|Text to speech|
|---|---|---|
|`Ocp-Apim-Subscription-Key`|Yes|Yes|
|`Authorization: Bearer`|Yes|Yes|

When you're using the `Ocp-Apim-Subscription-Key` header, only your resource key must be provided. For example:

HTTPCopy

```
'Ocp-Apim-Subscription-Key': 'YourSpeechResourceKey'
```

When you're using the `Authorization: Bearer` header, you need to make a request to the `issueToken` endpoint. In this request, you exchange your resource key for an access token that's valid for 10 minutes.

Another option is to use Microsoft Entra authentication that also uses the `Authorization: Bearer` header, but with a token issued via Microsoft Entra ID. See [Use Microsoft Entra authentication](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#use-microsoft-entra-authentication).

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#how-to-get-an-access-token)

### How to get an access token

To get an access token, you need to make a request to the `issueToken` endpoint by using `Ocp-Apim-Subscription-Key` and your resource key.

The `issueToken` endpoint has this format:

HTTPCopy

```
https://<REGION_IDENTIFIER>.api.cognitive.microsoft.com/sts/v1.0/issueToken
```

Replace `<REGION_IDENTIFIER>` with the identifier that matches the [region](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/regions) of your Speech resource.

Use the following samples to create your access token request.

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#http-sample)

#### HTTP sample

This example is a simple HTTP request to get a token. Replace `YourSpeechResourceKey` with your resource key for the Speech service. If your Speech resource isn't in the West US region, replace the `Host` header with your region's host name.

HTTPCopy

```
POST /sts/v1.0/issueToken HTTP/1.1
Ocp-Apim-Subscription-Key: YourSpeechResourceKey
Host: eastus.api.cognitive.microsoft.com
Content-type: application/x-www-form-urlencoded
Content-Length: 0
```

The body of the response contains the access token in JSON Web Token (JWT) format.

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#powershell-sample)

#### PowerShell sample

This example is a simple PowerShell script to get an access token. Replace `YourSpeechResourceKey` with your resource key for the Speech service. Make sure to use the correct endpoint for the region that matches your Speech resource. This example is currently set to West US.

PowerShellCopy

```
$FetchTokenHeader = @{
  'Content-type'='application/x-www-form-urlencoded';
  'Content-Length'= '0';
  'Ocp-Apim-Subscription-Key' = 'YourSpeechResourceKey'
}

$OAuthToken = Invoke-RestMethod -Method POST -Uri https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken
 -Headers $FetchTokenHeader

# show the token received
$OAuthToken

```

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#curl-sample)

#### cURL sample

cURL is a command-line tool available in Linux (and in the Windows Subsystem for Linux). This cURL command illustrates how to get an access token. Replace `YourSpeechResourceKey` with your resource key for the Speech service. Make sure to use the correct endpoint for the region that matches your Speech resource. This example is currently set to West US.

ConsoleCopy

```
curl -v -X POST \
 "https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken" \
 -H "Content-type: application/x-www-form-urlencoded" \
 -H "Content-Length: 0" \
 -H "Ocp-Apim-Subscription-Key: YourSpeechResourceKey"
```

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#c-sample)

#### C# sample

This C# class illustrates how to get an access token. Pass your resource key for the Speech service when you instantiate the class. If your Speech resource isn't in the West US region, change the value of `FetchTokenUri` to match the region for your Speech resource.

C#Copy

```
public class Authentication
{
    public static readonly string FetchTokenUri =
        "https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken";
    private string subscriptionKey;
    private string token;

    public Authentication(string subscriptionKey)
    {
        this.subscriptionKey = subscriptionKey;
        this.token = FetchTokenAsync(FetchTokenUri, subscriptionKey).Result;
    }

    public string GetAccessToken()
    {
        return this.token;
    }

    private async Task<string> FetchTokenAsync(string fetchUri, string subscriptionKey)
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
            UriBuilder uriBuilder = new UriBuilder(fetchUri);

            var result = await client.PostAsync(uriBuilder.Uri.AbsoluteUri, null);
            Console.WriteLine("Token Uri: {0}", uriBuilder.Uri.AbsoluteUri);
            return await result.Content.ReadAsStringAsync();
        }
    }
}
```

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#python-sample)

#### Python sample

PythonCopy

```
# Request module must be installed.
# Run pip install requests if necessary.
import requests

subscription_key = 'REPLACE_WITH_YOUR_KEY'


def get_token(subscription_key):
    fetch_token_url = 'https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken'
    headers = {
        'Ocp-Apim-Subscription-Key': subscription_key
    }
    response = requests.post(fetch_token_url, headers=headers)
    access_token = str(response.text)
    print(access_token)
```

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#how-to-use-an-access-token)

### How to use an access token

The access token should be sent to the service as the `Authorization: Bearer <TOKEN>` header. Each access token is valid for 10 minutes. You can get a new token at any time, but to minimize network traffic and latency, we recommend using the same token for nine minutes.

Here's a sample HTTP request to the Speech to text REST API for short audio:

HTTPCopy

```
POST /cognitiveservices/v1 HTTP/1.1
Authorization: Bearer YOUR_ACCESS_TOKEN
Host: westus.stt.speech.microsoft.com
Content-type: application/ssml+xml
Content-Length: 199
Connection: Keep-Alive

// Message body here...
```

[](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming#use-microsoft-entra-authentication)

### Use Microsoft Entra authentication

To use Microsoft Entra authentication with the Speech to text REST API for short audio, you need to create an access token. The steps to obtain the access token consisting of Resource ID and Microsoft Entra access token are the same as when using the Speech SDK. Follow the steps here [Use Microsoft Entra authentication](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-configure-azure-ad-auth)

- Create an AI Foundry resource for Speech
- Configure the Speech resource for Microsoft Entra authentication
- Get a Microsoft Entra access token
- Get the Speech resource ID

After the resource ID and the Microsoft Entra access token were obtained, the actual access token can be constructed following this format:

HTTPCopy

```
aad#YOUR_RESOURCE_ID#YOUR_MICROSOFT_ENTRA_ACCESS_TOKEN
```

You need to include the "aad#" prefix and the "#" (hash) separator between resource ID and the access token.

Here's a sample HTTP request to the Speech to text REST API for short audio:

HTTPCopy

```
POST /cognitiveservices/v1 HTTP/1.1
Authorization: Bearer YOUR_ACCESS_TOKEN
Host: westus.stt.speech.microsoft.com
Content-type: application/ssml+xml
Content-Length: 199
Connection: Keep-Alive

// Message body here...
```

To learn more about Microsoft Entra access tokens, including token lifetime, visit [Access tokens in the Microsoft identity platform](https://learn.microsoft.com/en-us/azure/active-directory/develop/access-tokens).