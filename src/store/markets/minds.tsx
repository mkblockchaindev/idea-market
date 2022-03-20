import { IMarketSpecifics } from '.'
import MindsOutlineWhite from '../../assets/minds-outline-white.svg'
import MindsOutlineBlack from '../../assets/minds-outline-black.svg'
import { queryLambdavatar } from 'actions'

export default class MindsMarketSpecifics implements IMarketSpecifics {
  // Market

  getMarketName(): string {
    return 'Minds'
  }

  isEnabled(): boolean {
    return true
  }

  getMarketNameURLRepresentation(): string {
    return 'minds'
  }

  getMarketSVGBlack(): JSX.Element {
    return <MindsOutlineBlack className="w-4" />
  }

  getMarketSVGWhite(): JSX.Element {
    return <MindsOutlineWhite className="w-4" />
  }

  getMarketSVGTheme(theme?): JSX.Element {
    if (theme === 'dark') {
      return <MindsOutlineWhite className="w-4" />
    } else {
      return <MindsOutlineBlack className="w-4" />
    }
  }

  // Tokens

  getTokenURL(tokenName: string): string {
    return `https://minds.com/${this.getTokenNameURLRepresentation(tokenName)}`
  }

  getTokenIconURL(tokenName: string): Promise<string> {
    return queryLambdavatar({
      rawMarketName: this.getMarketNameURLRepresentation(),
      rawTokenName: this.getTokenNameURLRepresentation(tokenName),
    })
  }

  /**
   * Convert URL input to token value that will be stored on blockchain
   */
  convertUserInputToTokenName(userInput: string): string {
    if (!userInput) return null
    const parsedURL = userInput
      .replace('https://', '')
      .replace('www.', '')
      .replace('minds.com/', '')
      .replaceAll('/', '') // get rid of any extra slashes at end of URL
    return `@${parsedURL}`
  }

  getTokenNameURLRepresentation(tokenName: string): string {
    return tokenName.slice(1)
  }

  getTokenNameFromURLRepresentation(
    tokenNameInURLRepresentation: string
  ): string {
    return `@${tokenNameInURLRepresentation}`
  }

  getTokenDisplayName(tokenName: string): string {
    return tokenName
  }

  // List Token

  getListTokenPrefix(): string {
    return 'minds.com/'
  }

  getListTokenSuffix(): string {
    return ''
  }

  // Verification

  isVerificationEnabled(): boolean {
    return true
  }

  getVerificationExplanation(): string {
    return `To verify, you will be asked to add a verification code to your account's bio. After verification is complete you can remove it.`
  }

  getVerificationSHAPrompt(
    sha: string,
    marketName: string,
    tokenName: string
  ): string {
    return `Verifying myself on ideamarket.io: ${sha} ideamarket.io/i/${marketName}/${tokenName}`
  }

  getVerificationSHAPromptExplanation(): string {
    return `This is your verification code. Please edit your account's bio to contain the below content. After you made the edit, click Next.`
  }

  getVerificationConfirmCheckboxLabel(): string {
    return `I have edited the bio.`
  }
}
