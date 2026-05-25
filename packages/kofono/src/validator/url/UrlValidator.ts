import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export type SchemaUrlValidator = "url" | { url: UrlValidatorOpts };

export type UrlValidatorOpts = SchemaPropertyBaseValidator & {
    protocols?: string[];
    hostnames?: string[];
};

export const urlValidator = {
    name: "url" as const,
    factory: (selector: string, type: ValidationType, opts: UrlValidatorOpts) =>
        new UrlValidator(selector, type, opts),
    err: {
        InvalidType: "_URL_INVALID_TYPE",
        InvalidFormat: "_URL_INVALID_FORMAT",
        ProtocolUnallowed: "_URL_PROTOCOL_UNALLOWED",
        HostnameUnallowed: "_URL_HOSTNAME_UNALLOWED",
    },
};

export function url(
    opts: UrlValidatorOpts,
    expect?: string,
): SchemaUrlValidator {
    return {
        url: {
            ...opts,
            ...optional("error", expect),
        },
    };
}

/**
 * URL validator.
 * Validates if a string is a valid URL.
 * It checks for a properly formatted URL with protocol (http, https, ftp, etc.).
 * Optionally, it can check if the URL's protocol is in a list of allowed protocols.
 * Optionally, it can check if the URL's hostname is in a list of allowed hostnames.
 */
export class UrlValidator extends AbstractValidator implements Validator {
    private readonly protocols?: string[];
    private readonly hostnames?: string[];

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: UrlValidatorOpts,
    ) {
        super(attachTo, type, opts);
        this.protocols = opts.protocols;
        this.hostnames = opts.hostnames;
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        if (typeof ctx.value !== "string") {
            return this.error(urlValidator.err.InvalidType);
        }

        try {
            // Use URL constructor to validate the URL
            const url = new URL(ctx.value);

            // If protocols are specified, check if the URL's protocol is in the list
            if (this.protocols && this.protocols.length > 0) {
                // Extract protocol (remove trailing colon)
                const protocol = url.protocol.replace(/:$/, "");
                if (!this.protocols.includes(protocol)) {
                    return this.error(urlValidator.err.ProtocolUnallowed, {
                        protocols: this.protocols,
                    });
                }
            }

            // If hostnames are specified, check if the URL's hostname is in the list
            if (this.hostnames && this.hostnames.length > 0) {
                if (!this.hostnames.includes(url.hostname)) {
                    return this.error(urlValidator.err.HostnameUnallowed, {
                        hostnames: this.hostnames,
                    });
                }
            }

            return this.success();
        } catch (e) {
            return this.error(urlValidator.err.InvalidFormat, {
                error: e instanceof Error ? e.message : "Unknown error",
            });
        }
    }
}
