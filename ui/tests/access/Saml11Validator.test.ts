import { validateTicket } from '@/access/Saml11Validator';
import User, { AnonymousUser } from '@/access/User';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);
const xmlSoapResponse = process.env.XML_SOAP_RESPONSE as string;
const xmlSoapResponseRequestDenied = process.env.XML_SOAP_RESPONSE_REQUEST_DENIED as string;

describe('Saml11Validator', () => {

    describe('validateTicket', () => {

        it('should return the user on success', async () => {
            fetchMock.mockResponse(xmlSoapResponse);
            expect(await validateTicket('ticket')).toEqual(testUser);
        });

        it('should return an AnonymousUser on error', async () => {
            fetchMock.mockAbort();
            expect(await validateTicket('ticket')).toEqual(AnonymousUser);
        });

        it('should return an AnonymousUser on invalid ticket', async () => {
            fetchMock.mockResponse(xmlSoapResponseRequestDenied);
            expect(await validateTicket('ticket')).toEqual(AnonymousUser);
        });

    });

});
