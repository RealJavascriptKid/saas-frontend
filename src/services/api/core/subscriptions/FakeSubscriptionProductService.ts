/* eslint-disable @typescript-eslint/no-unused-vars */
import type { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import plans from "@/application/pricing/plans";
import { pricingState, pricingStore } from "@/store/modules/pricingStore";
import type { ISubscriptionProductService } from "./ISubscriptionProductService";
import { FakeApiService } from "../../FakeApiService"; 
import { get } from "svelte/store";
import { _ } from "svelte-i18n";
const $t = get(_);
export class FakeSubscriptionProductService
  extends FakeApiService implements ISubscriptionProductService
{
  constructor() {
    super("SubscriptionProduct");
  }
  getProducts(): Promise<SubscriptionProductDto[]> {
    super.setResponse("FakeSubscriptionProductService.setProducts:",plans)
    return new Promise((resolve, reject) => {
      super
        .getAll()
        .then((response: SubscriptionProductDto[]) => {
          const currencies: string[] = [];
          response.forEach((product) => {
            product.prices.forEach((price) => {
              if (!currencies.includes(price.currency)) {
                currencies.push(price.currency);
              }
            });
          });
          let currency = get(pricingState).currency;
          if (currencies.length > 0 && !currencies.includes(currency)) {
            pricingStore.setCurrency(currencies[0]);
          }
          pricingStore.setProducts(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  createProduct(
    product: SubscriptionProductDto
  ): Promise<SubscriptionProductDto> {
    super.setResponse("FakeSubscriptionProductService.createProduct","[SANDBOX] Method not implemented.");

    product.title = $t(product.title).toString();
    product.description = $t(product.description).toString();
    return super.post(product, `CreateProduct`);
  }
}
